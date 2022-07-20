// DEV 和 FAT公用即可
module.exports = {
  FAT: {
    "/api": {
      target: "http://10.5.153.1:8090",
      changeOrigin: true,
      pathRewrite: { "/api": "/api" },
    },
    "/config": {
      target: "http://10.5.153.151:8091",
      changeOrigin: true,
      pathRewrite: { "/config": "/api/config" },
    },
    "/report": {
      target: "http://10.5.153.151:8090",
      changeOrigin: true,
      pathRewrite: { "/report": "/api/report" },
    },
  },
  PROD: {
    "/api": {
      target: "http://10.5.153.1:8090",
      changeOrigin: true,
      pathRewrite: { "/api": "/api" },
    },
    "/config": {
      target: "http://10.5.153.151:8091",
      changeOrigin: true,
      pathRewrite: { "/config": "/api/config" },
    },
    "/report": {
      target: "http://10.5.153.151:8090",
      changeOrigin: true,
      pathRewrite: { "/report": "/api/report" },
    },
  },
};
