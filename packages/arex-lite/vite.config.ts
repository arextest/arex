import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
    }),
  ],
  resolve: {
    alias: {
      'arex-core': path.resolve('../arex-core/src'),
    },
  },
  server: {
    port: 18888,
  },
});
