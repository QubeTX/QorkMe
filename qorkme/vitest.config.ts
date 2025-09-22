import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['tests/setup.ts'],
    environmentMatchGlobs: [['tests/ui/**/*.{test,spec}.{ts,tsx}', 'jsdom']],
  },
  esbuild: {
    jsx: 'automatic',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
