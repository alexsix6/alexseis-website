/// <reference types="vitest" />
import path from 'node:path';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import rehypeHighlight from 'rehype-highlight';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		mdx({
			remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
			rehypePlugins: [rehypeHighlight],
		}),
		react(),
	],
	server: {
		cors: true,
		headers: {
			'Cross-Origin-Embedder-Policy': 'credentialless',
		},
		allowedHosts: true,
	},
	resolve: {
		extensions: ['.jsx', '.js', '.tsx', '.ts', '.json', '.mdx'],
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	build: {
		// Disable sourcemaps in production (security + smaller build)
		sourcemap: false,
		// Target modern browsers for smaller output
		target: 'es2020',
		// Manual chunk splitting for optimal caching
		rollupOptions: {
			output: {
				manualChunks: {
					// Core React (changes rarely → long cache)
					'vendor-react': ['react', 'react-dom', 'react-router-dom'],
					// UI framework (changes occasionally)
					'vendor-ui': ['framer-motion', 'lucide-react', 'clsx', 'tailwind-merge', 'class-variance-authority'],
					// Spline 3D (massive, loaded lazily via Agent3D)
					'vendor-spline': ['@splinetool/react-spline', '@splinetool/runtime'],
					// Three.js (Spline dependency)
					'vendor-three': ['three'],
					// Radix UI primitives
					'vendor-radix': [
						'@radix-ui/react-toast',
						'@radix-ui/react-label',
						'@radix-ui/react-slot',
					],
				},
			},
		},
		// Increase chunk size warning limit (Spline is intentionally large)
		chunkSizeWarningLimit: 800,
		// Use terser for better compression
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,   // Remove all console.log in production
				drop_debugger: true,  // Remove debugger statements
			},
		},
	},
	// ===== VITEST CONFIGURATION =====
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/test/setup.ts',
		css: true,
		include: ['src/**/*.{test,spec}.{ts,tsx}'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html'],
			include: ['src/**/*.{ts,tsx}'],
			exclude: ['src/types/**', 'src/test/**', 'src/content/**'],
		},
	},
});
