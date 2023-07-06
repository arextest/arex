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
    sourcemap: true,
    outDir: './dist',
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'ArexCommon',
      fileName: 'arex-common',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'antd', '@arextest/arex-core'],
      output: {
        globals: {
          react: 'react',
          antd: 'antd',
          'react-dom': 'react-dom',
          '@arextest/arex-core': '@arextest/arex-core',
        },
      },
    },
  },
});
