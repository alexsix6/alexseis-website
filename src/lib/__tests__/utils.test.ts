import { describe, it, expect } from 'vitest';
import { cn, validateEmail, generateSessionId, getClientIp } from '../utils';

// ===== cn() =====
describe('cn()', () => {
  it('merges classnames correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });

  it('resolves Tailwind conflicts (last wins)', () => {
    const result = cn('px-2 py-1', 'px-4');
    expect(result).toBe('py-1 px-4');
  });

  it('handles undefined and null inputs', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
  });

  it('returns empty string for no inputs', () => {
    expect(cn()).toBe('');
  });
});

// ===== validateEmail() =====
describe('validateEmail()', () => {
  it('accepts valid emails', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('test.name@domain.org')).toBe(true);
    expect(validateEmail('hello+tag@sub.domain.co')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('not-an-email')).toBe(false);
    expect(validateEmail('@no-user.com')).toBe(false);
    expect(validateEmail('missing@.com')).toBe(false);
    expect(validateEmail('spaces in@email.com')).toBe(false);
  });
});

// ===== generateSessionId() =====
describe('generateSessionId()', () => {
  it('returns a string starting with "session_"', () => {
    const id = generateSessionId();
    expect(id).toMatch(/^session_/);
  });

  it('includes timestamp and random chars', () => {
    const id = generateSessionId();
    const parts = id.split('_');
    expect(parts.length).toBe(3);
    // parts[1] should be numeric timestamp
    expect(Number(parts[1])).toBeGreaterThan(0);
    // parts[2] should be alphanumeric
    expect(parts[2]).toMatch(/^[a-z0-9]+$/);
  });

  it('generates unique IDs on consecutive calls', () => {
    const id1 = generateSessionId();
    const id2 = generateSessionId();
    expect(id1).not.toBe(id2);
  });
});

// ===== getClientIp() =====
describe('getClientIp()', () => {
  it('extracts IP from x-forwarded-for header', () => {
    const req = {
      headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' },
    };
    expect(getClientIp(req)).toBe('1.2.3.4');
  });

  it('extracts IP from x-forwarded-for when single IP', () => {
    const req = {
      headers: { 'x-forwarded-for': '10.0.0.1' },
    };
    expect(getClientIp(req)).toBe('10.0.0.1');
  });

  it('falls back to x-real-ip', () => {
    const req = {
      headers: { 'x-real-ip': '192.168.1.1' },
    };
    expect(getClientIp(req)).toBe('192.168.1.1');
  });

  it('falls back to connection.remoteAddress', () => {
    const req = {
      headers: {},
      connection: { remoteAddress: '127.0.0.1' },
    };
    expect(getClientIp(req)).toBe('127.0.0.1');
  });

  it('returns "unknown" when no IP source available', () => {
    const req = { headers: {} };
    expect(getClientIp(req)).toBe('unknown');
  });

  it('handles array x-forwarded-for header', () => {
    const req = {
      headers: { 'x-forwarded-for': ['1.2.3.4', '5.6.7.8'] },
    };
    expect(getClientIp(req)).toBe('1.2.3.4');
  });
});
