import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

// Two projects: node for API routes / pure logic under tests/, jsdom for
// component tests (tests/ui/ plus the vendored QubeTX kit tests that live
// alongside their sources in components/, lib/, hooks/).
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'node',
          environment: 'node',
          include: ['tests/**/*.{test,spec}.{ts,tsx}'],
          exclude: ['tests/ui/**'],
          setupFiles: ['tests/setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'jsdom',
          environment: 'jsdom',
          globals: true,
          include: [
            'tests/ui/**/*.{test,spec}.{ts,tsx}',
            'components/**/*.{test,spec}.{ts,tsx}',
            'lib/**/*.{test,spec}.{ts,tsx}',
            'lib/**/__tests__/**/*.{test,spec}.{ts,tsx}',
            'hooks/**/*.{test,spec}.{ts,tsx}',
          ],
          setupFiles: ['tests/setup.ts', 'test/setup.ts'],
        },
      },
    ],
  },
});
