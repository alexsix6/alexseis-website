/**
 * Shared Security Middleware for Vercel API Routes
 * Handles CORS, rate limiting, input sanitization, and security headers
 *
 * @version 1.0.0 - FASE 1 Security Remediation
 */

// ===== CONFIGURATION =====
const ALLOWED_ORIGINS = [
  'https://alexseis.com',
  'https://www.alexseis.com',
  'https://alexseis-website.vercel.app',
  // Add preview deployment patterns
];

// In development, also allow localhost
if (process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'development') {
  ALLOWED_ORIGINS.push('http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173');
}

const RATE_LIMIT_DEFAULTS = {
  chat: { maxRequests: 10, windowMs: 60000 },
  contact: { maxRequests: 5, windowMs: 300000 },   // 5 per 5 min
  intake: { maxRequests: 3, windowMs: 600000 },     // 3 per 10 min
  transcribe: { maxRequests: 5, windowMs: 300000 }, // 5 per 5 min
  'intake-agent': { maxRequests: 10, windowMs: 300000 },
};

// In-memory rate limit store (per Vercel function instance)
// Falls back gracefully - better than fail-open BigQuery approach
const rateLimitStore = new Map();

// ===== CORS =====
export function setCorsHeaders(req, res) {
  const origin = req.headers.origin || '';

  // Check if origin is allowed
  const isAllowed = ALLOWED_ORIGINS.some(allowed => {
    if (allowed === origin) return true;
    // Allow Vercel preview deployments
    if (origin.match(/^https:\/\/alexseis-website-.*\.vercel\.app$/)) return true;
    return false;
  });

  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    // Server-to-server requests (no origin header) - allow for Vercel internal
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGINS[0]);
  }
  // If origin is not allowed, we simply don't set the header (browser will block)

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight for 24h
  // Removed: Access-Control-Allow-Credentials with wildcard origin (forbidden combo)
}

// ===== SECURITY HEADERS =====
export function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}

// ===== RATE LIMITING (In-Memory, Fail-Closed) =====
export function checkRateLimit(ip, routeName = 'chat') {
  const config = RATE_LIMIT_DEFAULTS[routeName] || RATE_LIMIT_DEFAULTS.chat;
  const key = `${routeName}:${ip}`;
  const now = Date.now();

  // Clean up expired entries periodically
  if (rateLimitStore.size > 10000) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (now - v.windowStart > v.windowMs) {
        rateLimitStore.delete(k);
      }
    }
  }

  const entry = rateLimitStore.get(key);

  if (!entry || (now - entry.windowStart > config.windowMs)) {
    // New window
    rateLimitStore.set(key, {
      count: 1,
      windowStart: now,
      windowMs: config.windowMs,
    });
    return { success: true, remaining: config.maxRequests - 1 };
  }

  entry.count++;

  if (entry.count > config.maxRequests) {
    return { success: false, remaining: 0 };
  }

  return { success: true, remaining: config.maxRequests - entry.count };
}

// ===== INPUT SANITIZATION =====
export function sanitizeString(str, maxLength = 2000) {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .slice(0, maxLength)
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove potential script injection patterns
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

export function sanitizeEmail(email) {
  if (typeof email !== 'string') return '';
  const sanitized = email.trim().toLowerCase().slice(0, 254);
  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized)) {
    return null; // Invalid
  }
  return sanitized;
}

// ===== HONEYPOT CHECK =====
export function checkHoneypot(body) {
  // If the hidden honeypot field has a value, it's a bot
  if (body && body._hp_website) {
    return true; // Is bot
  }
  return false;
}

// ===== CLIENT IP =====
export function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
         req.headers['x-real-ip'] ||
         req.connection?.remoteAddress ||
         'unknown';
}

// ===== COMBINED MIDDLEWARE =====
/**
 * Apply all security middleware to a route handler.
 * Returns false if the request was handled (blocked/preflight), true if processing should continue.
 *
 * Usage:
 *   const securityResult = applySecurityMiddleware(req, res, 'contact');
 *   if (!securityResult.ok) return; // Request was already handled
 *   // ... your route logic
 */
export function applySecurityMiddleware(req, res, routeName = 'chat') {
  // Set security headers on every response
  setSecurityHeaders(res);

  // Set CORS headers
  setCorsHeaders(req, res);

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return { ok: false };
  }

  // Only allow POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return { ok: false };
  }

  // Rate limiting (fail-closed: if anything goes wrong, deny)
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(clientIp, routeName);

  if (!rateLimit.success) {
    res.status(429).json({
      error: 'Too many requests. Please wait before trying again.',
      retryAfter: Math.ceil((RATE_LIMIT_DEFAULTS[routeName]?.windowMs || 60000) / 1000),
    });
    return { ok: false };
  }

  // Honeypot check
  if (checkHoneypot(req.body)) {
    // Silently accept but don't process (don't tip off the bot)
    res.status(200).json({ success: true });
    return { ok: false };
  }

  return { ok: true, clientIp, rateLimit };
}
