import express from 'express';
const app = express();
import { createProxyMiddleware } from 'http-proxy-middleware';

import history from 'connect-history-api-fallback';
app.use(
  '/api',
  createProxyMiddleware({
    target: process.env.SERVICE_REPORT_URL,
    changeOrigin: true,
    pathRewrite: { '/api': '/api' },
  }),
);

app.use(
  '/config',
  createProxyMiddleware({
    target: process.env.SERVICE_REPORT_URL,
    changeOrigin: true,
    pathRewrite: { '/config': '/api/config' },
  }),
);

app.use(
  '/report',
  createProxyMiddleware({
    target: process.env.SERVICE_CONFIG_URL,
    changeOrigin: true,
    pathRewrite: { '/report': '/api/report' },
  }),
);

app.use(
  '/schedule',
  createProxyMiddleware({
    target: process.env.SERVICE_SCHEDULE_URL,
    changeOrigin: true,
    pathRewrite: { '/schedule': '/api' },
  }),
);

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
