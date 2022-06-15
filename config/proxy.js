// DEV 和 FAT公用即可
module.exports = {
  FAT: {
    '/api': {
      target: 'http://127.0.0.1:8080',
      changeOrigin: true,
      pathRewrite: { '/api': '/' },
    },
  },
  PROD: {
    '/api': {
      target: 'http://qingkong-v2.rico.org.cn',
      changeOrigin: true,
      pathRewrite: { '/api': '/' },
    }
  },
}
