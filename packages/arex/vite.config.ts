import react from '@vitejs/plugin-react-swc';
import path from 'path';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => ({
  plugins: [
    svgr(),
    react({
      jsxImportSource: '@emotion/react',
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
    Icons({ compiler: 'jsx', jsx: 'react' }),
    ...[
      mode === 'electron'
        ? [
            electron([
              {
                // Main-Process entry file of the Electron App.
                entry: 'electron/main.ts',
              },
              {
                entry: 'electron/preload.ts',
                onstart(options) {
                  // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
                  // instead of restarting the entire Electron App.
                  options.reload();
                },
              },
            ]),
            renderer(),
          ]
        : [],
    ],
  ],
  resolve: {
    alias: {
      '@': path.resolve('./src'),
      // '@arextest/arex-core/dist': path.resolve('../arex-core/dist'),
      // '@arextest/arex-core': path.resolve('../arex-core/src'),
      // '@arextest/arex-common': path.resolve('../arex-common/src'),
      // '@arextest/arex-request': path.resolve('../arex-request/src'),
    },
  },
  server: {
    host: '0.0.0.0',
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
}));
