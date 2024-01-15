import react from '@vitejs/plugin-react-swc';
// @ts-ignore
import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    svgr(),
    react({
      jsxImportSource: '@emotion/react',
    }),
  ],
  build: {
    // sourcemap: true,
    outDir: './dist',
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'ArexCore',
      fileName: 'arex-core',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'antd',
        // '@emotion/react', '@emotion/styled'
      ],
      output: {
        globals: {
          react: 'react',
          antd: 'antd',
          'react-dom': 'react-dom',
          // '@emotion/react': '@emotion/react', '@emotion/styled': '@emotion/styled',
        },
      },
    },
  },
});
