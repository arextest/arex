import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import electron from 'vite-plugin-electron';
import svgr from 'vite-plugin-svgr';

import port from './config/port.json';
import proxy from './config/proxy.json';
import copyFilePlugin from './copyFilePlugin';

export default defineConfig(async ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const isElectron = mode === 'electron';
  const isProduction = process.env.NODE_ENV === 'production';
  const electronServerUrl = 'http://localhost:' + port.electronPort;

  console.log(`🚀launching vite: ${isProduction ? '📦build' : '🔧dev'} [MODE: ${mode}]`);

  return {
    define: {
      __APP_VERSION__: await import('./package.json').then((pkg) => JSON.stringify(pkg.version)),
      __AUTH_PORT__: port.electronPort,
      'import.meta.env.AREX_REQUEST_RUNTIME': JSON.stringify(
        isProduction ? '/arex-request-runtime.js' : '/dist/arex-request-runtime.js',
      ),
    },
    resolve: {
      alias: {
        '@': path.resolve('./src'),
        '@arextest/arex-core/dist': path.resolve('../arex-core/src'),
        '@arextest/arex-core': path.resolve('../arex-core/src'),
        '@arextest/arex-request': path.resolve('../arex-request/src'),
      },
    },
    build: { sourcemap: true },
    plugins: [
      svgr(),
      react({
        jsxImportSource: '@emotion/react',
      }),
      // Copy plugins: copy arex-request-runtime.js to dist folder on dev and build
      copyFilePlugin({
        src: './node_modules/@arextest/arex-request-runtime/index.js',
        dest: 'dist/',
        rename: 'arex-request-runtime.js',
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

          // feature check
          proxyMap['/checkFeature' + item.path] = {
            target: isElectron ? electronServerUrl : item.target,
            changeOrigin: true,
            rewrite: isElectron ? undefined : () => item.target + '/vi/checkFeature',
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
