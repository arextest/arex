/// <reference types="vitest" />
/// <reference types="vite/client" />
import react from '@vitejs/plugin-react-swc';
// @ts-ignore
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
    }),
  ],
  build: {
    outDir: './dist',
    // sourcemap: true,
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'ArexRequest',
      fileName: 'arex-request',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'antd',
        '@arextest/arex-core',
        '@emotion/react',
        '@emotion/styled',
        'monaco-editor',
        '@monaco-editor/react',
      ],
      output: {
        globals: {
          react: 'react',
          antd: 'antd',
          'react-dom': 'react-dom',
          '@arextest/arex-core': '@arextest/arex-core',
          '@emotion/react': '@emotion/react',
          '@emotion/styled': '@emotion/styled',
          'monaco-editor': 'monaco-editor',
          '@monaco-editor/react': '@monaco-editor/react',
        },
      },
    },
  },
});
