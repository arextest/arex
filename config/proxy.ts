export default {
  FAT: {
    '/api': {
      target: 'http://10.5.153.1:8090',
      changeOrigin: true,
      pathRewrite: { '/api': '/api' },
    },
  },
  PROD: {
    '/api': {
      target: 'http://10.5.153.1:8090',
      changeOrigin: true,
      pathRewrite: { '/api': '/api' },
    }
  },
}
