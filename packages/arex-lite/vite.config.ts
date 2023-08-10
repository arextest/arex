import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    svgr(),
    react({
      jsxImportSource: '@emotion/react',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve('./src'),
      // '@arextest/arex-core': path.resolve('../arex-core/src'),
    },
  },
  server: {
    port: 18888,
  },
});
