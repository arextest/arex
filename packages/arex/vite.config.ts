import react from '@vitejs/plugin-react-swc';
import path from 'path';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron';
import svgr from 'vite-plugin-svgr';

import port from './config/port.json';
import proxy from './config/proxy.json';

export default defineConfig(async ({ mode }) => ({
  define: {
    __APP_VERSION__: await import('./package.json').then((pkg) => JSON.stringify(pkg.version)),
    __AUTH_PORT__: port.electronPort,
  },
  plugins: [
    svgr(),
    react({
      jsxImportSource: '@emotion/react',
    }),
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
          ]
        : [],
    ],
  ],
  resolve: {
    alias: {
      '@': path.resolve('./src'),
      // '@arextest/arex-core/dist': path.resolve('../arex-core/src'),
      // '@arextest/arex-core': path.resolve('../arex-core/src'),
      // '@arextest/arex-common': path.resolve('../arex-common/src'),
      '@arextest/arex-request': path.resolve('../arex-request/src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: port.vitePort,
    proxy: proxy.reduce<{
      [key: string]: {
        target: string;
        changeOrigin: boolean;
        rewrite: (path: string) => string;
      };
    }>((proxyMap, item) => {
      proxyMap[item.path] = {
        target: item.target,
        changeOrigin: true,
        rewrite: (path) => path.replace(item.path, '/api'),
      };
      // health check
      proxyMap['/version' + item.path] = {
        target: item.target,
        changeOrigin: true,
        rewrite: () => item.target + '/vi/health',
      };
      return proxyMap;
    }, {}),
  },
}));
