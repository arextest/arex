/// <reference types="vitest" />
/// <reference types="vite/client" />
import react from '@vitejs/plugin-react-swc';
// @ts-ignore
import path from 'path';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
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
      ],
      output: {
        globals: {
          react: 'react',
          antd: 'antd',
          'react-dom': 'react-dom',
          '@arextest/arex-core': '@arextest/arex-core',
          '@emotion/react': '@emotion/react',
          '@emotion/styled': '@emotion/styled',
        },
      },
    },
  },
});
