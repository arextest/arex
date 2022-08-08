export default {
  FAT: {
    '/api': {
      target: 'http://127.0.0.1:8080',
      changeOrigin: true,
      pathRewrite: { '/api': '/api' },
    },
    '/config': {
      target: 'http://10.5.153.151:8088',
      changeOrigin: true,
      pathRewrite: { '/config': '/config_api/config' },
    },
    '/report': {
      target: 'http://10.5.153.151:8088',
      changeOrigin: true,
      pathRewrite: { '/report': '/report_api/report' },
    },
    '/schedule': {
      target: 'http://10.5.153.151:8088',
      changeOrigin: true,
      pathRewrite: { '/schedule': '/schedule_api' },
    },
  },
  PROD: {
    '/api': {
      target: 'http://10.5.153.1:8090',
      changeOrigin: true,
      pathRewrite: { '/api': '/api' },
    },
    '/config': {
      target: 'http://10.5.153.151:8088',
      changeOrigin: true,
      pathRewrite: { '/config': '/config_api/config' },
    },
    '/report': {
      target: 'http://10.5.153.151:8088',
      changeOrigin: true,
      pathRewrite: { '/report': '/report_api/report' },
    },
    '/schedule': {
      target: 'http://10.5.153.151:8088',
      changeOrigin: true,
      pathRewrite: { '/schedule': '/schedule_api' },
    },
  },
};
