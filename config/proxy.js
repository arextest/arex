export default {
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
  },
  PROD: {
    '/api': {
      target: 'http://10.5.153.1:8090',
      changeOrigin: true,
      pathRewrite: { '/api': '/api' },
    },
    '/config': {
      target: 'http://10.5.153.1:8091',
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
  },
};
