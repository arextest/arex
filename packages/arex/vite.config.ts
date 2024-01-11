import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import electron from 'vite-plugin-electron';
import svgr from 'vite-plugin-svgr';

import port from './config/port.json';
import proxy from './config/proxy.json';

export default defineConfig(async ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const isElectron = mode === 'electron';
  const electronServerUrl = 'http://localhost:' + port.electronPort;

  console.log(`🚀launching vite: [mode: ${mode}]`);

  return {
    define: {
      __APP_VERSION__: await import('./package.json').then((pkg) => JSON.stringify(pkg.version)),
      __AUTH_PORT__: port.electronPort,
    },
    resolve: {
      alias: {
        '@': path.resolve('./src'),
        '@arextest/arex-core/dist': path.resolve('../arex-core/src'),
        '@arextest/arex-core': path.resolve('../arex-core/src'),
        // '@arextest/arex-common': path.resolve('../arex-common/src'),
        // '@arextest/arex-request': path.resolve('../arex-request/src'),
      },
    },
    plugins: [
      svgr(),
      react({
        jsxImportSource: '@emotion/react',
      }),
    ].concat(
      isElectron
        ? [
            electron([
              {
                entry: 'electron/main.ts',
              },
              {
                entry: 'electron/preload.ts',
                onstart: (options) => options.reload(),
              },
            ]),
          ]
        : [],
    ),
    server: {
      host: '0.0.0.0',
      port: port.vitePort,
      proxy: Object.assign(
        proxy.reduce<{
          [key: string]: {
            target: string;
            changeOrigin: boolean;
            rewrite: (path: string) => string;
          };
        }>((proxyMap, item) => {
          proxyMap[item.path] = {
            target: isElectron ? electronServerUrl : item.target,
            changeOrigin: true,
            rewrite: isElectron ? undefined : (path) => path.replace(item.path, '/api'),
          };
          // health check
          proxyMap['/version' + item.path] = {
            target: isElectron ? electronServerUrl : item.target,
            changeOrigin: true,
            rewrite: isElectron ? undefined : () => item.target + '/vi/health',
          };
          return proxyMap;
        }, {}),
        isElectron
          ? {
              '/api': {
                target: electronServerUrl,
                changeOrigin: true,
              },
            }
          : {},
      ),
    },
  };
});
