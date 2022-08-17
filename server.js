// const express = require('express')
import express from 'express';
const app = express();
import { createProxyMiddleware } from 'http-proxy-middleware';

// const { createProxyMiddleware } = require('http-proxy-middleware')
// const proxy = require('./config/proxy')
import proxy from './config/proxy.js';
// const envMap = require('./config/envMap.json')
// const { config = {} } = require('./package.json')
let { port = 8080, env = 'FAT' } = {};

import history from 'connect-history-api-fallback';
// const history = require('connect-history-api-fallback')

// 读取机器环境配置代理
// 发布到captain上，机器内脚本会给package.json加上 port 和 env，环境枚举为 FAT LPT FWS UAT PROD
// 由于proxy文件中不存在UAT代理，会导致下面的proxy middleware读到undifined
if (env === 'UAT') env = 'FAT';

for (const proxyKey in proxy[env]) {
  app.use(
    proxyKey,
    createProxyMiddleware({
      target: proxy[env][proxyKey].target,
      changeOrigin: proxy[env][proxyKey].changeOrigin,
      pathRewrite: proxy[env][proxyKey].pathRewrite,
    }),
  );
}

// 健康检查
app.get('/vi/health', (req, res) => {
  res.end(`365ms`);
});

app.get('/env', (req, res) => {
  res.send({
    SERVICE_REPORT_URL: process.env.SERVICE_REPORT_URL,
    SERVICE_CONFIG_URL: process.env.SERVICE_CONFIG_URL,
    SERVICE_SCHEDULE_URL: process.env.SERVICE_SCHEDULE_URL,
  });
});

app.use(history()); // 这里千万要注意，要在static静态资源上面
// 托管静态文件
app.use(express.static('dist'));

// 监听8080端口
app.listen(8080, function () {
  console.log('hi');
});
