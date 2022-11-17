// vite.config.ts
import react from 'file:///Users/wp/Projects.localized/arex-postman/arex/node_modules/.pnpm/@vitejs+plugin-react@2.1.0_vite@3.2.2/node_modules/@vitejs/plugin-react/dist/index.mjs';
import { themePreprocessorPlugin } from 'file:///Users/wp/Projects.localized/arex-postman/arex/node_modules/.pnpm/@zougt+vite-plugin-theme-preprocessor@1.4.5/node_modules/@zougt/vite-plugin-theme-preprocessor/dist/index.js';
import { defineConfig } from 'file:///Users/wp/Projects.localized/arex-postman/arex/node_modules/.pnpm/vite@3.2.2_less@4.1.3/node_modules/vite/dist/node/index.js';

// config/proxy.js
var proxy_default = {
  FAT: {
    '/api': {
      target: 'http://10.5.153.1:8090',
      changeOrigin: true,
      pathRewrite: { '/api': '/api' },
    },
    '/config': {
      target: 'http://10.5.153.1:8090',
      changeOrigin: true,
      pathRewrite: { '/config': '/api/config' },
    },
    '/report': {
      target: 'http://10.5.153.1:8090',
      changeOrigin: true,
      pathRewrite: { '/report': '/api/report' },
    },
    '/schedule': {
      target: 'http://10.5.153.1:8092',
      changeOrigin: true,
      pathRewrite: { '/schedule': '/api' },
    },
    '/storage': {
      target: 'http://10.5.153.1:8093',
      changeOrigin: true,
      pathRewrite: { '/storage': '/api' },
    },
  },
  PROD: {
    '/api': {
      target: 'http://10.5.153.1:8090',
      changeOrigin: true,
      pathRewrite: { '/api': '/api' },
    },
    '/config': {
      target: 'http://10.5.153.1:8090',
      changeOrigin: true,
      pathRewrite: { '/config': '/api/config' },
    },
    '/report': {
      target: 'http://10.5.153.1:8090',
      changeOrigin: true,
      pathRewrite: { '/report': '/api/report' },
    },
    '/schedule': {
      target: 'http://10.5.153.1:8092',
      changeOrigin: true,
      pathRewrite: { '/schedule': '/api' },
    },
    '/storage': {
      target: 'http://10.5.153.1:8093',
      changeOrigin: true,
      pathRewrite: { '/storage': '/api' },
    },
  },
};

// config/themePreprocessorOptions.js
import path from 'path';

// src/style/theme/darkGreen/index.ts
import colorLib from 'file:///Users/wp/Projects.localized/arex-postman/arex/node_modules/.pnpm/@kurkle+color@0.2.1/node_modules/@kurkle/color/dist/color.js';
var name = 'dark-green';
var primaryColor = '#7cb305';
var theme = {
  color: {
    primary: primaryColor,
    active: 'rgba(255, 255, 255, 0.08)',
    selected: colorLib(primaryColor).alpha(0.1).rgbString(),
    success: '#2e7d32',
    info: '#0288d1',
    warning: '#ed6c02',
    error: '#d32f2f',
    text: {
      primary: 'rgba(255, 255, 255, 0.9)',
      secondary: 'rgba(255, 255, 255, 0.6)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      watermark: 'rgba(255, 255, 255, 0.1)',
      highlight: primaryColor,
    },
    border: {
      primary: '#303030',
    },
    background: {
      primary: '#202020',
      active: '#FFFFFF0A',
      hover: '#444',
    },
  },
};
var darkGreen_default = { name, theme, primaryColor };

// src/style/theme/darkPurple/index.ts
import colorLib2 from 'file:///Users/wp/Projects.localized/arex-postman/arex/node_modules/.pnpm/@kurkle+color@0.2.1/node_modules/@kurkle/color/dist/color.js';
var name2 = 'dark-purple';
var primaryColor2 = '#955cf4';
var theme2 = {
  color: {
    primary: primaryColor2,
    active: 'rgba(255, 255, 255, 0.08)',
    selected: colorLib2(primaryColor2).alpha(0.1).rgbString(),
    success: '#2e7d32',
    info: '#0288d1',
    warning: '#ed6c02',
    error: '#d32f2f',
    text: {
      primary: 'rgba(255, 255, 255, 0.9)',
      secondary: 'rgba(255, 255, 255, 0.6)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      watermark: 'rgba(255, 255, 255, 0.1)',
      highlight: primaryColor2,
    },
    border: {
      primary: '#303030',
    },
    background: {
      primary: '#202020',
      active: '#FFFFFF0A',
      hover: '#444',
    },
  },
};
var darkPurple_default = { name: name2, theme: theme2, primaryColor: primaryColor2 };

// src/style/theme/darkRed/index.ts
import colorLib3 from 'file:///Users/wp/Projects.localized/arex-postman/arex/node_modules/.pnpm/@kurkle+color@0.2.1/node_modules/@kurkle/color/dist/color.js';
var name3 = 'dark-red';
var primaryColor3 = '#ff4d4f';
var theme3 = {
  color: {
    primary: primaryColor3,
    active: 'rgba(255, 255, 255, 0.08)',
    selected: colorLib3(primaryColor3).alpha(0.1).rgbString(),
    success: '#2e7d32',
    info: '#0288d1',
    warning: '#ed6c02',
    error: '#d32f2f',
    text: {
      primary: 'rgba(255, 255, 255, 0.9)',
      secondary: 'rgba(255, 255, 255, 0.6)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      watermark: 'rgba(255, 255, 255, 0.1)',
      highlight: primaryColor3,
    },
    border: {
      primary: '#303030',
    },
    background: {
      primary: '#202020',
      active: '#FFFFFF0A',
      hover: '#444',
    },
  },
};
var darkRed_default = { name: name3, theme: theme3, primaryColor: primaryColor3 };

// src/style/theme/lightGreen/index.ts
import colorLib4 from 'file:///Users/wp/Projects.localized/arex-postman/arex/node_modules/.pnpm/@kurkle+color@0.2.1/node_modules/@kurkle/color/dist/color.js';
var name4 = 'light-green';
var primaryColor4 = '#5b8c00';
var theme4 = {
  color: {
    primary: primaryColor4,
    active: '#f5f5f5',
    selected: colorLib4(primaryColor4).alpha(0.1).rgbString(),
    success: '#66bb6a',
    info: '#29b6f6',
    warning: '#ffa726',
    error: '#f44336',
    text: {
      primary: 'rgba(0,0,0,0.9)',
      secondary: 'rgba(0,0,0,0.7)',
      disabled: 'rgba(0,0,0,0.3)',
      watermark: 'rgba(0,0,0,0.1)',
      highlight: primaryColor4,
    },
    border: {
      primary: '#F0F0F0',
    },
    background: {
      primary: '#ffffff',
      active: '#fafafa',
      hover: '#eee',
    },
  },
};
var lightGreen_default = { name: name4, theme: theme4, primaryColor: primaryColor4 };

// src/style/theme/lightPurple/index.ts
import colorLib5 from 'file:///Users/wp/Projects.localized/arex-postman/arex/node_modules/.pnpm/@kurkle+color@0.2.1/node_modules/@kurkle/color/dist/color.js';
var name5 = 'light-purple';
var primaryColor5 = '#603be3';
var theme5 = {
  color: {
    primary: primaryColor5,
    active: '#f5f5f5',
    selected: colorLib5(primaryColor5).alpha(0.1).rgbString(),
    success: '#66bb6a',
    info: '#29b6f6',
    warning: '#ffa726',
    error: '#f44336',
    text: {
      primary: 'rgba(0,0,0,0.9)',
      secondary: 'rgba(0,0,0,0.7)',
      disabled: 'rgba(0,0,0,0.3)',
      watermark: 'rgba(0,0,0,0.1)',
      highlight: primaryColor5,
    },
    border: {
      primary: '#F0F0F0',
    },
    background: {
      primary: '#ffffff',
      active: '#fafafa',
      hover: '#eee',
    },
  },
};
var lightPurple_default = { name: name5, theme: theme5, primaryColor: primaryColor5 };

// src/style/theme/lightRed/index.ts
import colorLib6 from 'file:///Users/wp/Projects.localized/arex-postman/arex/node_modules/.pnpm/@kurkle+color@0.2.1/node_modules/@kurkle/color/dist/color.js';
var name6 = 'light-red';
var primaryColor6 = '#cf1322';
var theme6 = {
  color: {
    primary: primaryColor6,
    active: '#f5f5f5',
    selected: colorLib6(primaryColor6).alpha(0.1).rgbString(),
    success: '#66bb6a',
    info: '#29b6f6',
    warning: '#ffa726',
    error: '#f44336',
    text: {
      primary: 'rgba(0,0,0,0.9)',
      secondary: 'rgba(0,0,0,0.7)',
      disabled: 'rgba(0,0,0,0.3)',
      watermark: 'rgba(0,0,0,0.1)',
      highlight: primaryColor6,
    },
    border: {
      primary: '#F0F0F0',
    },
    background: {
      primary: '#ffffff',
      active: '#fafafa',
      hover: '#eee',
    },
  },
};
var lightRed_default = { name: name6, theme: theme6, primaryColor: primaryColor6 };

// src/style/theme/index.ts
var Theme = {
  lightPurple: lightPurple_default.name,
  darkPurple: darkPurple_default.name,
  lightRed: lightRed_default.name,
  darkRed: darkRed_default.name,
  lightGreen: lightGreen_default.name,
  darkGreen: darkGreen_default.name,
};
var primaryColorPalette = {
  ['dark' /* dark */]: [
    { key: darkPurple_default.primaryColor, name: darkPurple_default.name },
    { key: darkRed_default.primaryColor, name: darkRed_default.name },
    { key: darkGreen_default.primaryColor, name: darkGreen_default.name },
  ],
  ['light' /* light */]: [
    { key: lightPurple_default.primaryColor, name: lightPurple_default.name },
    { key: lightRed_default.primaryColor, name: lightRed_default.name },
    { key: lightGreen_default.primaryColor, name: lightGreen_default.name },
  ],
};
var themeMap = {
  [Theme.lightPurple]: lightPurple_default.theme,
  [Theme.darkPurple]: darkPurple_default.theme,
  [Theme.lightRed]: lightRed_default.theme,
  [Theme.darkRed]: darkRed_default.theme,
  [Theme.lightGreen]: lightGreen_default.theme,
  [Theme.darkGreen]: darkGreen_default.theme,
};

// src/defaultConfig.ts
var defaultConfig = {
  language: 'en-US',
  theme: Theme.darkPurple,
  themePrimaryColor: darkPurple_default.primaryColor,
  themeClassify: 'dark' /* dark */,
  fontSize: 'medium',
};
var defaultConfig_default = defaultConfig;

// config/themePreprocessorOptions.js
var includeStyles = {
  '.ant-btn-text': {
    border: 'none',
    'box-shadow': 'none',
  },
  '.ant-input-borderless,.ant-input': {
    border: 'none',
    'box-shadow': 'none',
  },
  '.ant-menu': {
    'box-shadow': 'none',
  },
};
var themePreprocessorOptions_default = {
  less: {
    multipleScopeVars: [
      {
        scopeName: lightPurple_default.name,
        path: path.resolve('src/style/theme/lightPurple/index.less'),
        includeStyles,
      },
      {
        scopeName: darkPurple_default.name,
        path: path.resolve('src/style/theme/darkPurple/index.less'),
        includeStyles,
      },
      {
        scopeName: lightRed_default.name,
        path: path.resolve('src/style/theme/lightRed/index.less'),
        includeStyles,
      },
      {
        scopeName: darkRed_default.name,
        path: path.resolve('src/style/theme/darkRed/index.less'),
        includeStyles,
      },
      {
        scopeName: lightGreen_default.name,
        path: path.resolve('src/style/theme/lightGreen/index.less'),
        includeStyles,
      },
      {
        scopeName: darkGreen_default.name,
        path: path.resolve('src/style/theme/darkGreen/index.less'),
        includeStyles,
      },
    ],
    defaultScopeName: defaultConfig_default.theme,
    includeStyleWithColors: [
      {
        color: '#ffffff',
      },
    ],
    extract: true,
    outputDir: '',
    themeLinkTagId: 'theme-link-tag',
    themeLinkTagInjectTo: 'head',
    removeCssScopeName: false,
    customThemeCssFileName: (scopeName) => scopeName,
  },
};

// vite.config.ts
var env = 'FAT';
var convertProxyConfig = {};
var proxyConfig = proxy_default[env];
for (const proxyConfigKey in proxyConfig) {
  const rewriteKey = Object.keys(proxyConfig[proxyConfigKey].pathRewrite)[0];
  const rewriteValue = String(Object.values(proxyConfig[proxyConfigKey].pathRewrite)[0]);
  convertProxyConfig[proxyConfigKey] = {};
  convertProxyConfig[proxyConfigKey].target = proxyConfig[proxyConfigKey].target;
  convertProxyConfig[proxyConfigKey].changeOrigin = proxyConfig[proxyConfigKey].changeOrigin;
  convertProxyConfig[proxyConfigKey].rewrite = (path2) => path2.replace(rewriteKey, rewriteValue);
}
var vite_config_default = defineConfig({
  optimizeDeps: {
    exclude: ['@zougt/vite-plugin-theme-preprocessor/dist/browser-utils'],
  },
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
    }),
    themePreprocessorPlugin(themePreprocessorOptions_default),
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
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiY29uZmlnL3Byb3h5LmpzIiwgImNvbmZpZy90aGVtZVByZXByb2Nlc3Nvck9wdGlvbnMuanMiLCAic3JjL3N0eWxlL3RoZW1lL2RhcmtHcmVlbi9pbmRleC50cyIsICJzcmMvc3R5bGUvdGhlbWUvZGFya1B1cnBsZS9pbmRleC50cyIsICJzcmMvc3R5bGUvdGhlbWUvZGFya1JlZC9pbmRleC50cyIsICJzcmMvc3R5bGUvdGhlbWUvbGlnaHRHcmVlbi9pbmRleC50cyIsICJzcmMvc3R5bGUvdGhlbWUvbGlnaHRQdXJwbGUvaW5kZXgudHMiLCAic3JjL3N0eWxlL3RoZW1lL2xpZ2h0UmVkL2luZGV4LnRzIiwgInNyYy9zdHlsZS90aGVtZS9pbmRleC50cyIsICJzcmMvZGVmYXVsdENvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy93cC9Qcm9qZWN0cy5sb2NhbGl6ZWQvYXJleC1wb3N0bWFuL2FyZXhcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy93cC9Qcm9qZWN0cy5sb2NhbGl6ZWQvYXJleC1wb3N0bWFuL2FyZXgvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3dwL1Byb2plY3RzLmxvY2FsaXplZC9hcmV4LXBvc3RtYW4vYXJleC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyB0aGVtZVByZXByb2Nlc3NvclBsdWdpbiB9IGZyb20gJ0B6b3VndC92aXRlLXBsdWdpbi10aGVtZS1wcmVwcm9jZXNzb3InO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5cbmltcG9ydCBwcm94eSBmcm9tICcuL2NvbmZpZy9wcm94eS5qcyc7XG5pbXBvcnQgdGhlbWVQcmVwcm9jZXNzb3JPcHRpb25zIGZyb20gJy4vY29uZmlnL3RoZW1lUHJlcHJvY2Vzc29yT3B0aW9ucyc7XG5cbmNvbnN0IGVudiA9ICdGQVQnO1xuY29uc3QgY29udmVydFByb3h5Q29uZmlnOiBhbnkgPSB7fTtcbmNvbnN0IHByb3h5Q29uZmlnID0gcHJveHlbZW52XTtcblxuZm9yIChjb25zdCBwcm94eUNvbmZpZ0tleSBpbiBwcm94eUNvbmZpZykge1xuICBjb25zdCByZXdyaXRlS2V5ID0gT2JqZWN0LmtleXMocHJveHlDb25maWdbcHJveHlDb25maWdLZXldLnBhdGhSZXdyaXRlKVswXTtcbiAgY29uc3QgcmV3cml0ZVZhbHVlID0gU3RyaW5nKE9iamVjdC52YWx1ZXMocHJveHlDb25maWdbcHJveHlDb25maWdLZXldLnBhdGhSZXdyaXRlKVswXSk7XG4gIGNvbnZlcnRQcm94eUNvbmZpZ1twcm94eUNvbmZpZ0tleV0gPSB7fTtcbiAgY29udmVydFByb3h5Q29uZmlnW3Byb3h5Q29uZmlnS2V5XS50YXJnZXQgPSBwcm94eUNvbmZpZ1twcm94eUNvbmZpZ0tleV0udGFyZ2V0O1xuICBjb252ZXJ0UHJveHlDb25maWdbcHJveHlDb25maWdLZXldLmNoYW5nZU9yaWdpbiA9IHByb3h5Q29uZmlnW3Byb3h5Q29uZmlnS2V5XS5jaGFuZ2VPcmlnaW47XG4gIGNvbnZlcnRQcm94eUNvbmZpZ1twcm94eUNvbmZpZ0tleV0ucmV3cml0ZSA9IChwYXRoOiBzdHJpbmcpID0+XG4gICAgcGF0aC5yZXBsYWNlKHJld3JpdGVLZXksIHJld3JpdGVWYWx1ZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIG9wdGltaXplRGVwczoge1xuICAgIC8vXHUzMDEwXHU2Q0U4XHU2MTBGXHUzMDExIFx1NjM5Mlx1OTY2NCBpbXBvcnQgeyB0b2dnbGVUaGVtZSB9IGZyb20gXCJAem91Z3Qvdml0ZS1wbHVnaW4tdGhlbWUtcHJlcHJvY2Vzc29yL2Rpc3QvYnJvd3Nlci11dGlsc1wiOyBcdTU3Mjh2aXRlXHU3Njg0XHU3RjEzXHU1QjU4XHU0RjlEXHU4RDU2XG4gICAgZXhjbHVkZTogWydAem91Z3Qvdml0ZS1wbHVnaW4tdGhlbWUtcHJlcHJvY2Vzc29yL2Rpc3QvYnJvd3Nlci11dGlscyddLFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3Qoe1xuICAgICAganN4SW1wb3J0U291cmNlOiAnQGVtb3Rpb24vcmVhY3QnLFxuICAgIH0pLFxuICAgIHRoZW1lUHJlcHJvY2Vzc29yUGx1Z2luKHRoZW1lUHJlcHJvY2Vzc29yT3B0aW9ucyksXG4gIF0sXG4gIGNzczoge1xuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgIGxlc3M6IHtcbiAgICAgICAgamF2YXNjcmlwdEVuYWJsZWQ6IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIGVzYnVpbGQ6IHtcbiAgICBsb2dPdmVycmlkZTogeyAndGhpcy1pcy11bmRlZmluZWQtaW4tZXNtJzogJ3NpbGVudCcgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICB0YXJnZXQ6ICdlczIwMTUnLFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwcm94eTogY29udmVydFByb3h5Q29uZmlnLFxuICAgIGhvc3Q6ICcwLjAuMC4wJyxcbiAgICBwb3J0OiA4ODg4LFxuICB9LFxufSk7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy93cC9Qcm9qZWN0cy5sb2NhbGl6ZWQvYXJleC1wb3N0bWFuL2FyZXgvY29uZmlnXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvd3AvUHJvamVjdHMubG9jYWxpemVkL2FyZXgtcG9zdG1hbi9hcmV4L2NvbmZpZy9wcm94eS5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvd3AvUHJvamVjdHMubG9jYWxpemVkL2FyZXgtcG9zdG1hbi9hcmV4L2NvbmZpZy9wcm94eS5qc1wiO2V4cG9ydCBkZWZhdWx0IHtcbiAgRkFUOiB7XG4gICAgJy9hcGknOiB7XG4gICAgICB0YXJnZXQ6ICdodHRwOi8vMTAuNS4xNTMuMTo4MDkwJyxcbiAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgIHBhdGhSZXdyaXRlOiB7ICcvYXBpJzogJy9hcGknIH0sXG4gICAgfSxcbiAgICAnL2NvbmZpZyc6IHtcbiAgICAgIHRhcmdldDogJ2h0dHA6Ly8xMC41LjE1My4xOjgwOTAnLFxuICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgcGF0aFJld3JpdGU6IHsgJy9jb25maWcnOiAnL2FwaS9jb25maWcnIH0sXG4gICAgfSxcbiAgICAnL3JlcG9ydCc6IHtcbiAgICAgIHRhcmdldDogJ2h0dHA6Ly8xMC41LjE1My4xOjgwOTAnLFxuICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgcGF0aFJld3JpdGU6IHsgJy9yZXBvcnQnOiAnL2FwaS9yZXBvcnQnIH0sXG4gICAgfSxcbiAgICAnL3NjaGVkdWxlJzoge1xuICAgICAgdGFyZ2V0OiAnaHR0cDovLzEwLjUuMTUzLjE6ODA5MicsXG4gICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICBwYXRoUmV3cml0ZTogeyAnL3NjaGVkdWxlJzogJy9hcGknIH0sXG4gICAgfSxcbiAgICAnL3N0b3JhZ2UnOiB7XG4gICAgICB0YXJnZXQ6ICdodHRwOi8vMTAuNS4xNTMuMTo4MDkzJyxcbiAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgIHBhdGhSZXdyaXRlOiB7ICcvc3RvcmFnZSc6ICcvYXBpJyB9LFxuICAgIH0sXG4gIH0sXG4gIFBST0Q6IHtcbiAgICAnL2FwaSc6IHtcbiAgICAgIHRhcmdldDogJ2h0dHA6Ly8xMC41LjE1My4xOjgwOTAnLFxuICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgcGF0aFJld3JpdGU6IHsgJy9hcGknOiAnL2FwaScgfSxcbiAgICB9LFxuICAgICcvY29uZmlnJzoge1xuICAgICAgdGFyZ2V0OiAnaHR0cDovLzEwLjUuMTUzLjE6ODA5MCcsXG4gICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICBwYXRoUmV3cml0ZTogeyAnL2NvbmZpZyc6ICcvYXBpL2NvbmZpZycgfSxcbiAgICB9LFxuICAgICcvcmVwb3J0Jzoge1xuICAgICAgdGFyZ2V0OiAnaHR0cDovLzEwLjUuMTUzLjE6ODA5MCcsXG4gICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICBwYXRoUmV3cml0ZTogeyAnL3JlcG9ydCc6ICcvYXBpL3JlcG9ydCcgfSxcbiAgICB9LFxuICAgICcvc2NoZWR1bGUnOiB7XG4gICAgICB0YXJnZXQ6ICdodHRwOi8vMTAuNS4xNTMuMTo4MDkyJyxcbiAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgIHBhdGhSZXdyaXRlOiB7ICcvc2NoZWR1bGUnOiAnL2FwaScgfSxcbiAgICB9LFxuICAgICcvc3RvcmFnZSc6IHtcbiAgICAgIHRhcmdldDogJ2h0dHA6Ly8xMC41LjE1My4xOjgwOTMnLFxuICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgcGF0aFJld3JpdGU6IHsgJy9zdG9yYWdlJzogJy9hcGknIH0sXG4gICAgfSxcbiAgfSxcbn07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy93cC9Qcm9qZWN0cy5sb2NhbGl6ZWQvYXJleC1wb3N0bWFuL2FyZXgvY29uZmlnXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvd3AvUHJvamVjdHMubG9jYWxpemVkL2FyZXgtcG9zdG1hbi9hcmV4L2NvbmZpZy90aGVtZVByZXByb2Nlc3Nvck9wdGlvbnMuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3dwL1Byb2plY3RzLmxvY2FsaXplZC9hcmV4LXBvc3RtYW4vYXJleC9jb25maWcvdGhlbWVQcmVwcm9jZXNzb3JPcHRpb25zLmpzXCI7Ly8gdml0ZS1wbHVnaW4tdGhlbWUtcHJlcHJvY2Vzc29yIFx1NjNEMlx1NEVGNlx1OTE0RFx1N0Y2RSAtIFx1OTg4NFx1OEJCRVx1NEUzQlx1OTg5OFx1NkEyMVx1NUYwRlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL0dpdE9mWkdUL3ZpdGUtcGx1Z2luLXRoZW1lLXByZXByb2Nlc3Nvci9ibG9iL21hc3Rlci9SRUFETUUuemgubWQjJUU5JUEyJTg0JUU4JUFFJUJFJUU0JUI4JUJCJUU5JUEyJTk4JUU2JUE4JUExJUU1JUJDJThGXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IGRlZmF1bHRDb25maWcgZnJvbSAnLi4vc3JjL2RlZmF1bHRDb25maWcudHMnO1xuLy8gQHRzLWlnbm9yZVxuaW1wb3J0IERhcmtHcmVlbiBmcm9tICcuLi9zcmMvc3R5bGUvdGhlbWUvZGFya0dyZWVuJztcbmltcG9ydCBEYXJrUHVycGxlIGZyb20gJy4uL3NyYy9zdHlsZS90aGVtZS9kYXJrUHVycGxlJztcbmltcG9ydCBEYXJrUmVkIGZyb20gJy4uL3NyYy9zdHlsZS90aGVtZS9kYXJrUmVkJztcbmltcG9ydCBMaWdodEdyZWVuIGZyb20gJy4uL3NyYy9zdHlsZS90aGVtZS9saWdodEdyZWVuJztcbmltcG9ydCBMaWdodFB1cnBsZSBmcm9tICcuLi9zcmMvc3R5bGUvdGhlbWUvbGlnaHRQdXJwbGUnO1xuaW1wb3J0IExpZ2h0UmVkIGZyb20gJy4uL3NyYy9zdHlsZS90aGVtZS9saWdodFJlZCc7XG5cbmNvbnN0IGluY2x1ZGVTdHlsZXMgPSB7XG4gICcuYW50LWJ0bi10ZXh0Jzoge1xuICAgIGJvcmRlcjogJ25vbmUnLFxuICAgICdib3gtc2hhZG93JzogJ25vbmUnLFxuICB9LFxuICAnLmFudC1pbnB1dC1ib3JkZXJsZXNzLC5hbnQtaW5wdXQnOiB7XG4gICAgYm9yZGVyOiAnbm9uZScsXG4gICAgJ2JveC1zaGFkb3cnOiAnbm9uZScsXG4gIH0sXG4gICcuYW50LW1lbnUnOiB7XG4gICAgJ2JveC1zaGFkb3cnOiAnbm9uZScsXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8vIFx1NEY3Rlx1NzUyOExlc3NcbiAgbGVzczoge1xuICAgIC8vIFx1NkI2NFx1NTkwNFx1OTE0RFx1N0Y2RVx1ODFFQVx1NURGMVx1NzY4NFx1NEUzQlx1OTg5OFx1NjU4N1x1NEVGNlxuICAgIG11bHRpcGxlU2NvcGVWYXJzOiBbXG4gICAgICB7XG4gICAgICAgIHNjb3BlTmFtZTogTGlnaHRQdXJwbGUubmFtZSxcbiAgICAgICAgcGF0aDogcGF0aC5yZXNvbHZlKCdzcmMvc3R5bGUvdGhlbWUvbGlnaHRQdXJwbGUvaW5kZXgubGVzcycpLFxuICAgICAgICBpbmNsdWRlU3R5bGVzLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgc2NvcGVOYW1lOiBEYXJrUHVycGxlLm5hbWUsXG4gICAgICAgIHBhdGg6IHBhdGgucmVzb2x2ZSgnc3JjL3N0eWxlL3RoZW1lL2RhcmtQdXJwbGUvaW5kZXgubGVzcycpLFxuICAgICAgICBpbmNsdWRlU3R5bGVzLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgc2NvcGVOYW1lOiBMaWdodFJlZC5uYW1lLFxuICAgICAgICBwYXRoOiBwYXRoLnJlc29sdmUoJ3NyYy9zdHlsZS90aGVtZS9saWdodFJlZC9pbmRleC5sZXNzJyksXG4gICAgICAgIGluY2x1ZGVTdHlsZXMsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBzY29wZU5hbWU6IERhcmtSZWQubmFtZSxcbiAgICAgICAgcGF0aDogcGF0aC5yZXNvbHZlKCdzcmMvc3R5bGUvdGhlbWUvZGFya1JlZC9pbmRleC5sZXNzJyksXG4gICAgICAgIGluY2x1ZGVTdHlsZXMsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBzY29wZU5hbWU6IExpZ2h0R3JlZW4ubmFtZSxcbiAgICAgICAgcGF0aDogcGF0aC5yZXNvbHZlKCdzcmMvc3R5bGUvdGhlbWUvbGlnaHRHcmVlbi9pbmRleC5sZXNzJyksXG4gICAgICAgIGluY2x1ZGVTdHlsZXMsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBzY29wZU5hbWU6IERhcmtHcmVlbi5uYW1lLFxuICAgICAgICBwYXRoOiBwYXRoLnJlc29sdmUoJ3NyYy9zdHlsZS90aGVtZS9kYXJrR3JlZW4vaW5kZXgubGVzcycpLFxuICAgICAgICBpbmNsdWRlU3R5bGVzLFxuICAgICAgfSxcbiAgICBdLFxuICAgIGRlZmF1bHRTY29wZU5hbWU6IGRlZmF1bHRDb25maWcudGhlbWUsIC8vIFx1OUVEOFx1OEJBNFx1NTNENiBtdWx0aXBsZVNjb3BlVmFyc1swXS5zY29wZU5hbWVcbiAgICBpbmNsdWRlU3R5bGVXaXRoQ29sb3JzOiBbXG4gICAgICB7XG4gICAgICAgIC8vIGNvbG9yXHU0RTVGXHU1M0VGXHU0RUU1XHU2NjJGYXJyYXlcdUZGMENcdTU5ODIgW1wiI2ZmZmZmZlwiLFwiIzAwMFwiXVxuICAgICAgICBjb2xvcjogJyNmZmZmZmYnLFxuICAgICAgICAvLyBcdTYzOTJcdTk2NjRcdTVDNUVcdTYwMjdcdUZGMENcdTU5ODIgXHU0RTBEXHU2M0QwXHU1M0Q2XHU4MENDXHU2NjZGXHU4MjcyXHU3Njg0I2ZmZmZmZlxuICAgICAgICAvLyBleGNsdWRlQ3NzUHJvcHM6W1wiYmFja2dyb3VuZFwiLFwiYmFja2dyb3VuZC1jb2xvclwiXVxuICAgICAgICAvLyBcdTYzOTJcdTk2NjRcdTkwMDlcdTYyRTlcdTU2NjhcdUZGMENcdTU5ODIgXHU0RTBEXHU2M0QwXHU1M0Q2XHU0RUU1XHU0RTBCXHU5MDA5XHU2MkU5XHU1NjY4XHU3Njg0ICNmZmZmZmZcbiAgICAgICAgLy8gZXhjbHVkZVNlbGVjdG9yczogW1xuICAgICAgICAvLyAgIFwiLmFudC1idG4tbGluazpob3ZlciwgLmFudC1idG4tbGluazpmb2N1cywgLmFudC1idG4tbGluazphY3RpdmVcIixcbiAgICAgICAgLy8gXSxcbiAgICAgIH0sXG4gICAgXSxcbiAgICAvLyBcdTU3MjhcdTc1MUZcdTRFQTdcdTZBMjFcdTVGMEZcdTY2MkZcdTU0MjZcdTYyQkRcdTUzRDZcdTcyRUNcdTdBQ0JcdTc2ODRcdTRFM0JcdTk4OThjc3NcdTY1ODdcdTRFRjZcdUZGMENleHRyYWN0XHU0RTNBdHJ1ZVx1NEVFNVx1NEUwQlx1NUM1RVx1NjAyN1x1NjcwOVx1NjU0OFxuICAgIGV4dHJhY3Q6IHRydWUsXG4gICAgLy8gXHU3MkVDXHU3QUNCXHU0RTNCXHU5ODk4Y3NzXHU2NTg3XHU0RUY2XHU3Njg0XHU4RjkzXHU1MUZBXHU4REVGXHU1Rjg0XHVGRjBDXHU5RUQ4XHU4QkE0XHU1M0Q2IHZpdGVDb25maWcuYnVpbGQuYXNzZXRzRGlyIFx1NzZGOFx1NUJGOVx1NEU4RSAodml0ZUNvbmZpZy5idWlsZC5vdXREaXIpXG4gICAgb3V0cHV0RGlyOiAnJyxcbiAgICAvLyBcdTRGMUFcdTkwMDlcdTUzRDZkZWZhdWx0U2NvcGVOYW1lXHU1QkY5XHU1RTk0XHU3Njg0XHU0RTNCXHU5ODk4Y3NzXHU2NTg3XHU0RUY2XHU1NzI4aHRtbFx1NkRGQlx1NTJBMGxpbmtcbiAgICB0aGVtZUxpbmtUYWdJZDogJ3RoZW1lLWxpbmstdGFnJyxcbiAgICAvLyBcImhlYWRcInx8XCJoZWFkLXByZXBlbmRcIiB8fCBcImJvZHlcIiB8fFwiYm9keS1wcmVwZW5kXCJcbiAgICB0aGVtZUxpbmtUYWdJbmplY3RUbzogJ2hlYWQnLFxuICAgIC8vIFx1NjYyRlx1NTQyNlx1NUJGOVx1NjJCRFx1NTNENlx1NzY4NGNzc1x1NjU4N1x1NEVGNlx1NTE4NVx1NUJGOVx1NUU5NHNjb3BlTmFtZVx1NzY4NFx1Njc0M1x1OTFDRFx1N0M3Qlx1NTQwRFx1NzlGQlx1OTY2NFxuICAgIHJlbW92ZUNzc1Njb3BlTmFtZTogZmFsc2UsXG4gICAgLy8gXHU1M0VGXHU0RUU1XHU4MUVBXHU1QjlBXHU0RTQ5Y3NzXHU2NTg3XHU0RUY2XHU1NDBEXHU3OUYwXHU3Njg0XHU1MUZEXHU2NTcwXG4gICAgY3VzdG9tVGhlbWVDc3NGaWxlTmFtZTogKHNjb3BlTmFtZSkgPT4gc2NvcGVOYW1lLFxuICB9LFxufTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3dwL1Byb2plY3RzLmxvY2FsaXplZC9hcmV4LXBvc3RtYW4vYXJleC9zcmMvc3R5bGUvdGhlbWUvZGFya0dyZWVuXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvd3AvUHJvamVjdHMubG9jYWxpemVkL2FyZXgtcG9zdG1hbi9hcmV4L3NyYy9zdHlsZS90aGVtZS9kYXJrR3JlZW4vaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3dwL1Byb2plY3RzLmxvY2FsaXplZC9hcmV4LXBvc3RtYW4vYXJleC9zcmMvc3R5bGUvdGhlbWUvZGFya0dyZWVuL2luZGV4LnRzXCI7aW1wb3J0IGNvbG9yTGliIGZyb20gJ0BrdXJrbGUvY29sb3InO1xuXG5pbXBvcnQgeyBUaGVtZU5hbWUgfSBmcm9tICcuLi9pbmRleCc7XG5cbmNvbnN0IG5hbWUgPSAnZGFyay1ncmVlbicgYXMgVGhlbWVOYW1lO1xuY29uc3QgcHJpbWFyeUNvbG9yID0gJyM3Y2IzMDUnO1xuY29uc3QgdGhlbWUgPSB7XG4gIGNvbG9yOiB7XG4gICAgcHJpbWFyeTogcHJpbWFyeUNvbG9yLFxuICAgIGFjdGl2ZTogJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMC4wOCknLFxuICAgIHNlbGVjdGVkOiBjb2xvckxpYihwcmltYXJ5Q29sb3IpLmFscGhhKDAuMSkucmdiU3RyaW5nKCksXG4gICAgc3VjY2VzczogJyMyZTdkMzInLFxuICAgIGluZm86ICcjMDI4OGQxJyxcbiAgICB3YXJuaW5nOiAnI2VkNmMwMicsXG4gICAgZXJyb3I6ICcjZDMyZjJmJyxcbiAgICB0ZXh0OiB7XG4gICAgICBwcmltYXJ5OiAncmdiYSgyNTUsIDI1NSwgMjU1LCAwLjkpJyxcbiAgICAgIHNlY29uZGFyeTogJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMC42KScsXG4gICAgICBkaXNhYmxlZDogJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMC4zKScsXG4gICAgICB3YXRlcm1hcms6ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSknLFxuICAgICAgaGlnaGxpZ2h0OiBwcmltYXJ5Q29sb3IsXG4gICAgfSxcbiAgICBib3JkZXI6IHtcbiAgICAgIHByaW1hcnk6ICcjMzAzMDMwJyxcbiAgICB9LFxuICAgIGJhY2tncm91bmQ6IHtcbiAgICAgIHByaW1hcnk6ICcjMjAyMDIwJyxcbiAgICAgIGFjdGl2ZTogJyNGRkZGRkYwQScsXG4gICAgICBob3ZlcjogJyM0NDQnLFxuICAgIH0sXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCB7IG5hbWUsIHRoZW1lLCBwcmltYXJ5Q29sb3IgfTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3dwL1Byb2plY3RzLmxvY2FsaXplZC9hcmV4LXBvc3RtYW4vYXJleC9zcmMvc3R5bGUvdGhlbWUvZGFya1B1cnBsZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3dwL1Byb2plY3RzLmxvY2FsaXplZC9hcmV4LXBvc3RtYW4vYXJleC9zcmMvc3R5bGUvdGhlbWUvZGFya1B1cnBsZS9pbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvd3AvUHJvamVjdHMubG9jYWxpemVkL2FyZXgtcG9zdG1hbi9hcmV4L3NyYy9zdHlsZS90aGVtZS9kYXJrUHVycGxlL2luZGV4LnRzXCI7aW1wb3J0IGNvbG9yTGliIGZyb20gJ0BrdXJrbGUvY29sb3InO1xuXG5pbXBvcnQgeyBUaGVtZU5hbWUgfSBmcm9tICcuLi9pbmRleCc7XG5cbmNvbnN0IG5hbWUgPSAnZGFyay1wdXJwbGUnIGFzIFRoZW1lTmFtZTtcbmNvbnN0IHByaW1hcnlDb2xvciA9ICcjOTU1Y2Y0JztcbmNvbnN0IHRoZW1lID0ge1xuICBjb2xvcjoge1xuICAgIHByaW1hcnk6IHByaW1hcnlDb2xvcixcbiAgICBhY3RpdmU6ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDgpJyxcbiAgICBzZWxlY3RlZDogY29sb3JMaWIocHJpbWFyeUNvbG9yKS5hbHBoYSgwLjEpLnJnYlN0cmluZygpLFxuICAgIHN1Y2Nlc3M6ICcjMmU3ZDMyJyxcbiAgICBpbmZvOiAnIzAyODhkMScsXG4gICAgd2FybmluZzogJyNlZDZjMDInLFxuICAgIGVycm9yOiAnI2QzMmYyZicsXG4gICAgdGV4dDoge1xuICAgICAgcHJpbWFyeTogJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMC45KScsXG4gICAgICBzZWNvbmRhcnk6ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNiknLFxuICAgICAgZGlzYWJsZWQ6ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMyknLFxuICAgICAgd2F0ZXJtYXJrOiAncmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpJyxcbiAgICAgIGhpZ2hsaWdodDogcHJpbWFyeUNvbG9yLFxuICAgIH0sXG4gICAgYm9yZGVyOiB7XG4gICAgICBwcmltYXJ5OiAnIzMwMzAzMCcsXG4gICAgfSxcbiAgICBiYWNrZ3JvdW5kOiB7XG4gICAgICBwcmltYXJ5OiAnIzIwMjAyMCcsXG4gICAgICBhY3RpdmU6ICcjRkZGRkZGMEEnLFxuICAgICAgaG92ZXI6ICcjNDQ0JyxcbiAgICB9LFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgeyBuYW1lLCB0aGVtZSwgcHJpbWFyeUNvbG9yIH07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy93cC9Qcm9qZWN0cy5sb2NhbGl6ZWQvYXJleC1wb3N0bWFuL2FyZXgvc3JjL3N0eWxlL3RoZW1lL2RhcmtSZWRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy93cC9Qcm9qZWN0cy5sb2NhbGl6ZWQvYXJleC1wb3N0bWFuL2FyZXgvc3JjL3N0eWxlL3RoZW1lL2RhcmtSZWQvaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3dwL1Byb2plY3RzLmxvY2FsaXplZC9hcmV4LXBvc3RtYW4vYXJleC9zcmMvc3R5bGUvdGhlbWUvZGFya1JlZC9pbmRleC50c1wiO2ltcG9ydCBjb2xvckxpYiBmcm9tICdAa3Vya2xlL2NvbG9yJztcblxuaW1wb3J0IHsgVGhlbWVOYW1lIH0gZnJvbSAnLi4vaW5kZXgnO1xuXG5jb25zdCBuYW1lID0gJ2RhcmstcmVkJyBhcyBUaGVtZU5hbWU7XG5jb25zdCBwcmltYXJ5Q29sb3IgPSAnI2ZmNGQ0Zic7XG5jb25zdCB0aGVtZSA9IHtcbiAgY29sb3I6IHtcbiAgICBwcmltYXJ5OiBwcmltYXJ5Q29sb3IsXG4gICAgYWN0aXZlOiAncmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA4KScsXG4gICAgc2VsZWN0ZWQ6IGNvbG9yTGliKHByaW1hcnlDb2xvcikuYWxwaGEoMC4xKS5yZ2JTdHJpbmcoKSxcbiAgICBzdWNjZXNzOiAnIzJlN2QzMicsXG4gICAgaW5mbzogJyMwMjg4ZDEnLFxuICAgIHdhcm5pbmc6ICcjZWQ2YzAyJyxcbiAgICBlcnJvcjogJyNkMzJmMmYnLFxuICAgIHRleHQ6IHtcbiAgICAgIHByaW1hcnk6ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOSknLFxuICAgICAgc2Vjb25kYXJ5OiAncmdiYSgyNTUsIDI1NSwgMjU1LCAwLjYpJyxcbiAgICAgIGRpc2FibGVkOiAncmdiYSgyNTUsIDI1NSwgMjU1LCAwLjMpJyxcbiAgICAgIHdhdGVybWFyazogJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMC4xKScsXG4gICAgICBoaWdobGlnaHQ6IHByaW1hcnlDb2xvcixcbiAgICB9LFxuICAgIGJvcmRlcjoge1xuICAgICAgcHJpbWFyeTogJyMzMDMwMzAnLFxuICAgIH0sXG4gICAgYmFja2dyb3VuZDoge1xuICAgICAgcHJpbWFyeTogJyMyMDIwMjAnLFxuICAgICAgYWN0aXZlOiAnI0ZGRkZGRjBBJyxcbiAgICAgIGhvdmVyOiAnIzQ0NCcsXG4gICAgfSxcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHsgbmFtZSwgdGhlbWUsIHByaW1hcnlDb2xvciB9O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvd3AvUHJvamVjdHMubG9jYWxpemVkL2FyZXgtcG9zdG1hbi9hcmV4L3NyYy9zdHlsZS90aGVtZS9saWdodEdyZWVuXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvd3AvUHJvamVjdHMubG9jYWxpemVkL2FyZXgtcG9zdG1hbi9hcmV4L3NyYy9zdHlsZS90aGVtZS9saWdodEdyZWVuL2luZGV4LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy93cC9Qcm9qZWN0cy5sb2NhbGl6ZWQvYXJleC1wb3N0bWFuL2FyZXgvc3JjL3N0eWxlL3RoZW1lL2xpZ2h0R3JlZW4vaW5kZXgudHNcIjtpbXBvcnQgY29sb3JMaWIgZnJvbSAnQGt1cmtsZS9jb2xvcic7XG5cbmltcG9ydCB7IFRoZW1lTmFtZSB9IGZyb20gJy4uL2luZGV4JztcblxuY29uc3QgbmFtZSA9ICdsaWdodC1ncmVlbicgYXMgVGhlbWVOYW1lO1xuY29uc3QgcHJpbWFyeUNvbG9yID0gJyM1YjhjMDAnO1xuY29uc3QgdGhlbWUgPSB7XG4gIGNvbG9yOiB7XG4gICAgcHJpbWFyeTogcHJpbWFyeUNvbG9yLFxuICAgIGFjdGl2ZTogJyNmNWY1ZjUnLFxuICAgIHNlbGVjdGVkOiBjb2xvckxpYihwcmltYXJ5Q29sb3IpLmFscGhhKDAuMSkucmdiU3RyaW5nKCksXG4gICAgc3VjY2VzczogJyM2NmJiNmEnLFxuICAgIGluZm86ICcjMjliNmY2JyxcbiAgICB3YXJuaW5nOiAnI2ZmYTcyNicsXG4gICAgZXJyb3I6ICcjZjQ0MzM2JyxcbiAgICB0ZXh0OiB7XG4gICAgICBwcmltYXJ5OiAncmdiYSgwLDAsMCwwLjkpJyxcbiAgICAgIHNlY29uZGFyeTogJ3JnYmEoMCwwLDAsMC43KScsXG4gICAgICBkaXNhYmxlZDogJ3JnYmEoMCwwLDAsMC4zKScsXG4gICAgICB3YXRlcm1hcms6ICdyZ2JhKDAsMCwwLDAuMSknLFxuICAgICAgaGlnaGxpZ2h0OiBwcmltYXJ5Q29sb3IsXG4gICAgfSxcbiAgICBib3JkZXI6IHtcbiAgICAgIHByaW1hcnk6ICcjRjBGMEYwJyxcbiAgICB9LFxuICAgIGJhY2tncm91bmQ6IHtcbiAgICAgIHByaW1hcnk6ICcjZmZmZmZmJyxcbiAgICAgIGFjdGl2ZTogJyNmYWZhZmEnLFxuICAgICAgaG92ZXI6ICcjZWVlJyxcbiAgICB9LFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgeyBuYW1lLCB0aGVtZSwgcHJpbWFyeUNvbG9yIH07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy93cC9Qcm9qZWN0cy5sb2NhbGl6ZWQvYXJleC1wb3N0bWFuL2FyZXgvc3JjL3N0eWxlL3RoZW1lL2xpZ2h0UHVycGxlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvd3AvUHJvamVjdHMubG9jYWxpemVkL2FyZXgtcG9zdG1hbi9hcmV4L3NyYy9zdHlsZS90aGVtZS9saWdodFB1cnBsZS9pbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvd3AvUHJvamVjdHMubG9jYWxpemVkL2FyZXgtcG9zdG1hbi9hcmV4L3NyYy9zdHlsZS90aGVtZS9saWdodFB1cnBsZS9pbmRleC50c1wiO2ltcG9ydCBjb2xvckxpYiBmcm9tICdAa3Vya2xlL2NvbG9yJztcblxuaW1wb3J0IHsgVGhlbWVOYW1lIH0gZnJvbSAnLi4vaW5kZXgnO1xuXG5jb25zdCBuYW1lID0gJ2xpZ2h0LXB1cnBsZScgYXMgVGhlbWVOYW1lO1xuY29uc3QgcHJpbWFyeUNvbG9yID0gJyM2MDNiZTMnO1xuY29uc3QgdGhlbWUgPSB7XG4gIGNvbG9yOiB7XG4gICAgcHJpbWFyeTogcHJpbWFyeUNvbG9yLFxuICAgIGFjdGl2ZTogJyNmNWY1ZjUnLFxuICAgIHNlbGVjdGVkOiBjb2xvckxpYihwcmltYXJ5Q29sb3IpLmFscGhhKDAuMSkucmdiU3RyaW5nKCksXG4gICAgc3VjY2VzczogJyM2NmJiNmEnLFxuICAgIGluZm86ICcjMjliNmY2JyxcbiAgICB3YXJuaW5nOiAnI2ZmYTcyNicsXG4gICAgZXJyb3I6ICcjZjQ0MzM2JyxcbiAgICB0ZXh0OiB7XG4gICAgICBwcmltYXJ5OiAncmdiYSgwLDAsMCwwLjkpJyxcbiAgICAgIHNlY29uZGFyeTogJ3JnYmEoMCwwLDAsMC43KScsXG4gICAgICBkaXNhYmxlZDogJ3JnYmEoMCwwLDAsMC4zKScsXG4gICAgICB3YXRlcm1hcms6ICdyZ2JhKDAsMCwwLDAuMSknLFxuICAgICAgaGlnaGxpZ2h0OiBwcmltYXJ5Q29sb3IsXG4gICAgfSxcbiAgICBib3JkZXI6IHtcbiAgICAgIHByaW1hcnk6ICcjRjBGMEYwJyxcbiAgICB9LFxuICAgIGJhY2tncm91bmQ6IHtcbiAgICAgIHByaW1hcnk6ICcjZmZmZmZmJyxcbiAgICAgIGFjdGl2ZTogJyNmYWZhZmEnLFxuICAgICAgaG92ZXI6ICcjZWVlJyxcbiAgICB9LFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgeyBuYW1lLCB0aGVtZSwgcHJpbWFyeUNvbG9yIH07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy93cC9Qcm9qZWN0cy5sb2NhbGl6ZWQvYXJleC1wb3N0bWFuL2FyZXgvc3JjL3N0eWxlL3RoZW1lL2xpZ2h0UmVkXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvd3AvUHJvamVjdHMubG9jYWxpemVkL2FyZXgtcG9zdG1hbi9hcmV4L3NyYy9zdHlsZS90aGVtZS9saWdodFJlZC9pbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvd3AvUHJvamVjdHMubG9jYWxpemVkL2FyZXgtcG9zdG1hbi9hcmV4L3NyYy9zdHlsZS90aGVtZS9saWdodFJlZC9pbmRleC50c1wiO2ltcG9ydCBjb2xvckxpYiBmcm9tICdAa3Vya2xlL2NvbG9yJztcblxuaW1wb3J0IHsgVGhlbWVOYW1lIH0gZnJvbSAnLi4vaW5kZXgnO1xuXG5jb25zdCBuYW1lID0gJ2xpZ2h0LXJlZCcgYXMgVGhlbWVOYW1lO1xuY29uc3QgcHJpbWFyeUNvbG9yID0gJyNjZjEzMjInO1xuY29uc3QgdGhlbWUgPSB7XG4gIGNvbG9yOiB7XG4gICAgcHJpbWFyeTogcHJpbWFyeUNvbG9yLFxuICAgIGFjdGl2ZTogJyNmNWY1ZjUnLFxuICAgIHNlbGVjdGVkOiBjb2xvckxpYihwcmltYXJ5Q29sb3IpLmFscGhhKDAuMSkucmdiU3RyaW5nKCksXG4gICAgc3VjY2VzczogJyM2NmJiNmEnLFxuICAgIGluZm86ICcjMjliNmY2JyxcbiAgICB3YXJuaW5nOiAnI2ZmYTcyNicsXG4gICAgZXJyb3I6ICcjZjQ0MzM2JyxcbiAgICB0ZXh0OiB7XG4gICAgICBwcmltYXJ5OiAncmdiYSgwLDAsMCwwLjkpJyxcbiAgICAgIHNlY29uZGFyeTogJ3JnYmEoMCwwLDAsMC43KScsXG4gICAgICBkaXNhYmxlZDogJ3JnYmEoMCwwLDAsMC4zKScsXG4gICAgICB3YXRlcm1hcms6ICdyZ2JhKDAsMCwwLDAuMSknLFxuICAgICAgaGlnaGxpZ2h0OiBwcmltYXJ5Q29sb3IsXG4gICAgfSxcbiAgICBib3JkZXI6IHtcbiAgICAgIHByaW1hcnk6ICcjRjBGMEYwJyxcbiAgICB9LFxuICAgIGJhY2tncm91bmQ6IHtcbiAgICAgIHByaW1hcnk6ICcjZmZmZmZmJyxcbiAgICAgIGFjdGl2ZTogJyNmYWZhZmEnLFxuICAgICAgaG92ZXI6ICcjZWVlJyxcbiAgICB9LFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgeyBuYW1lLCB0aGVtZSwgcHJpbWFyeUNvbG9yIH07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy93cC9Qcm9qZWN0cy5sb2NhbGl6ZWQvYXJleC1wb3N0bWFuL2FyZXgvc3JjL3N0eWxlL3RoZW1lXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvd3AvUHJvamVjdHMubG9jYWxpemVkL2FyZXgtcG9zdG1hbi9hcmV4L3NyYy9zdHlsZS90aGVtZS9pbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvd3AvUHJvamVjdHMubG9jYWxpemVkL2FyZXgtcG9zdG1hbi9hcmV4L3NyYy9zdHlsZS90aGVtZS9pbmRleC50c1wiOy8vIGh0dHBzOi8vZW1vdGlvbi5zaC9kb2NzL3RoZW1pbmdcbmltcG9ydCB7IFRoZW1lIGFzIEVtb3Rpb25UaGVtZSB9IGZyb20gJ0BlbW90aW9uL3JlYWN0JztcblxuaW1wb3J0IERhcmtHcmVlbiBmcm9tICcuL2RhcmtHcmVlbic7XG5pbXBvcnQgRGFya1B1cnBsZSBmcm9tICcuL2RhcmtQdXJwbGUnO1xuaW1wb3J0IERhcmtSZWQgZnJvbSAnLi9kYXJrUmVkJztcbmltcG9ydCBMaWdodEdyZWVuIGZyb20gJy4vbGlnaHRHcmVlbic7XG5pbXBvcnQgTGlnaHRQdXJwbGUgZnJvbSAnLi9saWdodFB1cnBsZSc7XG5pbXBvcnQgTGlnaHRSZWQgZnJvbSAnLi9saWdodFJlZCc7XG5cbmV4cG9ydCBlbnVtIFRoZW1lQ2xhc3NpZnkge1xuICBsaWdodCA9ICdsaWdodCcsXG4gIGRhcmsgPSAnZGFyaycsXG59XG5leHBvcnQgZW51bSBQcmltYXJ5Q29sb3Ige1xuICBwdXJwbGUgPSAncHVycGxlJyxcbiAgcmVkID0gJ3JlZCcsXG4gIGdyZWVuID0gJ2dyZWVuJyxcbn1cblxuZXhwb3J0IHR5cGUgVGhlbWVOYW1lID0gYCR7VGhlbWVDbGFzc2lmeX0tJHtQcmltYXJ5Q29sb3J9YDtcbmV4cG9ydCBjb25zdCBUaGVtZTogeyBbdGhlbWU6IHN0cmluZ106IFRoZW1lTmFtZSB9ID0ge1xuICBsaWdodFB1cnBsZTogTGlnaHRQdXJwbGUubmFtZSxcbiAgZGFya1B1cnBsZTogRGFya1B1cnBsZS5uYW1lLFxuICBsaWdodFJlZDogTGlnaHRSZWQubmFtZSxcbiAgZGFya1JlZDogRGFya1JlZC5uYW1lLFxuICBsaWdodEdyZWVuOiBMaWdodEdyZWVuLm5hbWUsXG4gIGRhcmtHcmVlbjogRGFya0dyZWVuLm5hbWUsXG59O1xuXG5leHBvcnQgY29uc3QgcHJpbWFyeUNvbG9yUGFsZXR0ZTogeyBbdGhlbWVOYW1lOiBzdHJpbmddOiB7IGtleTogc3RyaW5nOyBuYW1lOiBUaGVtZU5hbWUgfVtdIH0gPSB7XG4gIFtUaGVtZUNsYXNzaWZ5LmRhcmtdOiBbXG4gICAgeyBrZXk6IERhcmtQdXJwbGUucHJpbWFyeUNvbG9yLCBuYW1lOiBEYXJrUHVycGxlLm5hbWUgfSxcbiAgICB7IGtleTogRGFya1JlZC5wcmltYXJ5Q29sb3IsIG5hbWU6IERhcmtSZWQubmFtZSB9LFxuICAgIHsga2V5OiBEYXJrR3JlZW4ucHJpbWFyeUNvbG9yLCBuYW1lOiBEYXJrR3JlZW4ubmFtZSB9LFxuICBdLFxuICBbVGhlbWVDbGFzc2lmeS5saWdodF06IFtcbiAgICB7IGtleTogTGlnaHRQdXJwbGUucHJpbWFyeUNvbG9yLCBuYW1lOiBMaWdodFB1cnBsZS5uYW1lIH0sXG4gICAgeyBrZXk6IExpZ2h0UmVkLnByaW1hcnlDb2xvciwgbmFtZTogTGlnaHRSZWQubmFtZSB9LFxuICAgIHsga2V5OiBMaWdodEdyZWVuLnByaW1hcnlDb2xvciwgbmFtZTogTGlnaHRHcmVlbi5uYW1lIH0sXG4gIF0sXG59O1xuXG5leHBvcnQgY29uc3QgdGhlbWVNYXA6IHsgW3RoZW1lTmFtZTogc3RyaW5nXTogRW1vdGlvblRoZW1lIH0gPSB7XG4gIFtUaGVtZS5saWdodFB1cnBsZV06IExpZ2h0UHVycGxlLnRoZW1lLFxuICBbVGhlbWUuZGFya1B1cnBsZV06IERhcmtQdXJwbGUudGhlbWUsXG4gIFtUaGVtZS5saWdodFJlZF06IExpZ2h0UmVkLnRoZW1lLFxuICBbVGhlbWUuZGFya1JlZF06IERhcmtSZWQudGhlbWUsXG4gIFtUaGVtZS5saWdodEdyZWVuXTogTGlnaHRHcmVlbi50aGVtZSxcbiAgW1RoZW1lLmRhcmtHcmVlbl06IERhcmtHcmVlbi50aGVtZSxcbn07XG5cbi8vIGh0dHBzOi8vZW1vdGlvbi5zaC9kb2NzL3R5cGVzY3JpcHQjZGVmaW5lLWEtdGhlbWVcbmRlY2xhcmUgbW9kdWxlICdAZW1vdGlvbi9yZWFjdCcge1xuICBleHBvcnQgaW50ZXJmYWNlIFRoZW1lIHtcbiAgICBjb2xvcjoge1xuICAgICAgcHJpbWFyeTogc3RyaW5nO1xuICAgICAgYWN0aXZlOiBzdHJpbmc7XG4gICAgICBzZWxlY3RlZDogc3RyaW5nO1xuICAgICAgc3VjY2Vzczogc3RyaW5nO1xuICAgICAgaW5mbzogc3RyaW5nO1xuICAgICAgd2FybmluZzogc3RyaW5nO1xuICAgICAgZXJyb3I6IHN0cmluZztcbiAgICAgIHRleHQ6IHtcbiAgICAgICAgcHJpbWFyeTogc3RyaW5nO1xuICAgICAgICBzZWNvbmRhcnk6IHN0cmluZztcbiAgICAgICAgZGlzYWJsZWQ6IHN0cmluZztcbiAgICAgICAgd2F0ZXJtYXJrOiBzdHJpbmc7XG4gICAgICAgIGhpZ2hsaWdodDogc3RyaW5nO1xuICAgICAgfTtcbiAgICAgIGJvcmRlcjoge1xuICAgICAgICBwcmltYXJ5OiBzdHJpbmc7XG4gICAgICB9O1xuICAgICAgYmFja2dyb3VuZDoge1xuICAgICAgICBwcmltYXJ5OiBzdHJpbmc7XG4gICAgICAgIGFjdGl2ZTogc3RyaW5nO1xuICAgICAgICBob3Zlcjogc3RyaW5nO1xuICAgICAgfTtcbiAgICB9O1xuICB9XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy93cC9Qcm9qZWN0cy5sb2NhbGl6ZWQvYXJleC1wb3N0bWFuL2FyZXgvc3JjXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvd3AvUHJvamVjdHMubG9jYWxpemVkL2FyZXgtcG9zdG1hbi9hcmV4L3NyYy9kZWZhdWx0Q29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy93cC9Qcm9qZWN0cy5sb2NhbGl6ZWQvYXJleC1wb3N0bWFuL2FyZXgvc3JjL2RlZmF1bHRDb25maWcudHNcIjtpbXBvcnQgeyBJMThuZXh0TG5nIH0gZnJvbSAnLi9pMThuJztcbmltcG9ydCB7IEZvbnRTaXplIH0gZnJvbSAnLi9wYWdlcy9TZXR0aW5nUGFnZSc7XG5pbXBvcnQgeyBUaGVtZSwgVGhlbWVDbGFzc2lmeSwgVGhlbWVOYW1lIH0gZnJvbSAnLi9zdHlsZS90aGVtZSc7XG5pbXBvcnQgRGFya1B1cnBsZSBmcm9tICcuL3N0eWxlL3RoZW1lL2RhcmtQdXJwbGUnO1xuXG5leHBvcnQgdHlwZSBEZWZhdWx0Q29uZmlnID0ge1xuICBsYW5ndWFnZTogSTE4bmV4dExuZztcbiAgdGhlbWU6IFRoZW1lTmFtZTtcbiAgdGhlbWVQcmltYXJ5Q29sb3I6IHN0cmluZztcbiAgdGhlbWVDbGFzc2lmeTogVGhlbWVDbGFzc2lmeTtcbiAgZm9udFNpemU6IEZvbnRTaXplO1xufTtcblxuY29uc3QgZGVmYXVsdENvbmZpZzogRGVmYXVsdENvbmZpZyA9IHtcbiAgbGFuZ3VhZ2U6ICdlbi1VUycsXG4gIHRoZW1lOiBUaGVtZS5kYXJrUHVycGxlLFxuICB0aGVtZVByaW1hcnlDb2xvcjogRGFya1B1cnBsZS5wcmltYXJ5Q29sb3IsXG4gIHRoZW1lQ2xhc3NpZnk6IFRoZW1lQ2xhc3NpZnkuZGFyaywgLy8gXHU2REYxXHU2RDQ1XHU1RTk0XHU0RThFIHRoZW1lIFx1NUJGOVx1NUU5NFxuICBmb250U2l6ZTogJ21lZGl1bScsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBkZWZhdWx0Q29uZmlnO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE0VCxPQUFPLFdBQVc7QUFDOVUsU0FBUywrQkFBK0I7QUFDeEMsU0FBUyxvQkFBb0I7OztBQ0Z3UyxJQUFPLGdCQUFRO0FBQUEsRUFDbFYsS0FBSztBQUFBLElBQ0gsUUFBUTtBQUFBLE1BQ04sUUFBUTtBQUFBLE1BQ1IsY0FBYztBQUFBLE1BQ2QsYUFBYSxFQUFFLFFBQVEsT0FBTztBQUFBLElBQ2hDO0FBQUEsSUFDQSxXQUFXO0FBQUEsTUFDVCxRQUFRO0FBQUEsTUFDUixjQUFjO0FBQUEsTUFDZCxhQUFhLEVBQUUsV0FBVyxjQUFjO0FBQUEsSUFDMUM7QUFBQSxJQUNBLFdBQVc7QUFBQSxNQUNULFFBQVE7QUFBQSxNQUNSLGNBQWM7QUFBQSxNQUNkLGFBQWEsRUFBRSxXQUFXLGNBQWM7QUFBQSxJQUMxQztBQUFBLElBQ0EsYUFBYTtBQUFBLE1BQ1gsUUFBUTtBQUFBLE1BQ1IsY0FBYztBQUFBLE1BQ2QsYUFBYSxFQUFFLGFBQWEsT0FBTztBQUFBLElBQ3JDO0FBQUEsSUFDQSxZQUFZO0FBQUEsTUFDVixRQUFRO0FBQUEsTUFDUixjQUFjO0FBQUEsTUFDZCxhQUFhLEVBQUUsWUFBWSxPQUFPO0FBQUEsSUFDcEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxNQUFNO0FBQUEsSUFDSixRQUFRO0FBQUEsTUFDTixRQUFRO0FBQUEsTUFDUixjQUFjO0FBQUEsTUFDZCxhQUFhLEVBQUUsUUFBUSxPQUFP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QUFNLGVBQWUsT0FBTyxPQUFPLE9BQU8sWUFBWSxnQkFBZ0IsV0FBVyxFQUFFLEVBQUU7QUFDckYscUJBQW1CLGtCQUFrQixDQUFDO0FBQ3RDLHFCQUFtQixnQkFBZ0IsU0FBUyxZQUFZLGdCQUFnQjtBQUN4RSxxQkFBbUIsZ0JBQWdCLGVBQWUsWUFBWSxnQkFBZ0I7QUFDOUUscUJBQW1CLGdCQUFnQixVQUFVLENBQUNHLFVBQzVDQSxNQUFLLFFBQVEsWUFBWSxZQUFZO0FBQ3pDO0FBRUEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsY0FBYztBQUFBLElBRVosU0FBUyxDQUFDLDBEQUEwRDtBQUFBLEVBQ3RFO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsTUFDSixpQkFBaUI7QUFBQSxJQUNuQixDQUFDO0FBQUEsSUFDRCx3QkFBd0IsZ0NBQXdCO0FBQUEsRUFDbEQ7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNILHFCQUFxQjtBQUFBLE1BQ25CLE1BQU07QUFBQSxRQUNKLG1CQUFtQjtBQUFBLE1BQ3JCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLGFBQWEsRUFBRSw0QkFBNEIsU0FBUztBQUFBLEVBQ3REO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsRUFDVjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogWyJjb2xvckxpYiIsICJuYW1lIiwgInByaW1hcnlDb2xvciIsICJ0aGVtZSIsICJjb2xvckxpYiIsICJjb2xvckxpYiIsICJuYW1lIiwgInByaW1hcnlDb2xvciIsICJ0aGVtZSIsICJjb2xvckxpYiIsICJjb2xvckxpYiIsICJuYW1lIiwgInByaW1hcnlDb2xvciIsICJ0aGVtZSIsICJjb2xvckxpYiIsICJjb2xvckxpYiIsICJuYW1lIiwgInByaW1hcnlDb2xvciIsICJ0aGVtZSIsICJjb2xvckxpYiIsICJjb2xvckxpYiIsICJuYW1lIiwgInByaW1hcnlDb2xvciIsICJ0aGVtZSIsICJjb2xvckxpYiIsICJwYXRoIl0KfQo=
