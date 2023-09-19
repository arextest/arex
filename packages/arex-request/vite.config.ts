/// <reference types="vitest" />
/// <reference types="vite/client" />
import react from '@vitejs/plugin-react-swc';
// @ts-ignore
import path from 'path';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
    }),
    dts({
      insertTypesEntry: true,
    }),
    Icons({ compiler: 'jsx', jsx: 'react' }),
  ],
  // test: {
  //   globals: true,
  //   environment: 'jsdom',
  //   setupFiles: ['./src/setupTests.ts'],
  // },

  build: {
    outDir: './dist',
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),
      name: 'ArexRequest',
      fileName: 'arex-request',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'antd', '@emotion/react', '@emotion/styled'],
      output: {
        globals: {
          react: 'react',
          antd: 'antd',
          'react-dom': 'react-dom',
          '@emotion/react': '@emotion/react',
          '@emotion/styled': '@emotion/styled',
        },
      },
    },
  },
});
