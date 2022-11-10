import react from '@vitejs/plugin-react';
import { themePreprocessorPlugin } from '@zougt/vite-plugin-theme-preprocessor';
import { defineConfig } from 'vite';

import proxy from './config/proxy.js';
import themePreprocessorOptions from './config/themePreprocessorOptions';

const env = 'FAT';
const convertProxyConfig: any = {};
const proxyConfig = proxy[env];

for (const proxyConfigKey in proxyConfig) {
  const rewriteKey = Object.keys(proxyConfig[proxyConfigKey].pathRewrite)[0];
  const rewriteValue = String(Object.values(proxyConfig[proxyConfigKey].pathRewrite)[0]);
  convertProxyConfig[proxyConfigKey] = {};
  convertProxyConfig[proxyConfigKey].target = proxyConfig[proxyConfigKey].target;
  convertProxyConfig[proxyConfigKey].changeOrigin = proxyConfig[proxyConfigKey].changeOrigin;
  convertProxyConfig[proxyConfigKey].rewrite = (path: string) =>
    path.replace(rewriteKey, rewriteValue);
}

export default defineConfig({
  optimizeDeps: {
    //【注意】 排除 import { toggleTheme } from "@zougt/vite-plugin-theme-preprocessor/dist/browser-utils"; 在vite的缓存依赖
    exclude: ['@zougt/vite-plugin-theme-preprocessor/dist/browser-utils'],
  },
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
    }),
    themePreprocessorPlugin(themePreprocessorOptions),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
  build: {
    target: 'es2015',
  },
  server: {
    proxy: convertProxyConfig,
    host: '0.0.0.0',
    port: 8888,
  },
});
