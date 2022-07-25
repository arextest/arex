import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {themePreprocessorPlugin} from "@zougt/vite-plugin-theme-preprocessor";
import themePreprocessorOptions from "./config/themePreprocessorOptions";
import proxy from "./config/proxy";
const env = "FAT";
const convertProxyConfig: any = {};
const proxyConfig = proxy[env];
import { Color } from "./src/style/theme";

for (const proxyConfigKey in proxyConfig) {
  const rewriteKey = Object.keys(proxyConfig[proxyConfigKey].pathRewrite)[0];
  const rewriteValue = String(
      Object.values(proxyConfig[proxyConfigKey].pathRewrite)[0]
  );
  convertProxyConfig[proxyConfigKey] = {};
  convertProxyConfig[proxyConfigKey].target =
      proxyConfig[proxyConfigKey].target;
  convertProxyConfig[proxyConfigKey].changeOrigin =
      proxyConfig[proxyConfigKey].changeOrigin;
  convertProxyConfig[proxyConfigKey].rewrite = (path: string) =>
      path.replace(rewriteKey, rewriteValue);
}

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
    themePreprocessorPlugin(themePreprocessorOptions),
  ],
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          "primary-color": Color.primaryColor,
        },
        javascriptEnabled: true,
      },
    },
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  server: {
    proxy: convertProxyConfig,
    host: "0.0.0.0",
    port: 8888,
  },
})
