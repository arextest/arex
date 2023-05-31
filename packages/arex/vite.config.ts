import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/arex-request-runtime/lib/index.js',
          dest: '',
          rename: 'arex-request-runtime.js',
        },
      ],
    }),
    {
      // 解决循环依赖
      name: 'singleHMR',
      handleHotUpdate({ modules }) {
        modules.map((m) => {
          m.importedModules = new Set();
          m.importers = new Set();
        });
        return modules;
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve('./src'),
      // 'arex-core': path.resolve('../arex-core/src'),
    },
  },
  server: {
    port: 16888,
    proxy: {
      '/report': {
        target: 'http://10.5.153.1:8090',
        changeOrigin: true,
        rewrite: (path) => path.replace('/report', '/api'),
      },
      '/schedule': {
        target: 'http://10.5.153.1:8092',
        changeOrigin: true,
        rewrite: (path) => path.replace('/schedule', '/api'),
      },
      '/storage': {
        target: 'http://10.5.153.1:8093',
        changeOrigin: true,
        rewrite: (path) => path.replace('/storage', '/api'),
      },
      '^/node/.*': {
        target: 'http://10.5.153.1:10001',
        changeOrigin: true,
        rewrite: (path) => path.replace('/node', '/'),
      },
    },
  },
});
