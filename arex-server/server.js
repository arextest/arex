import { createProxyMiddleware } from 'http-proxy-middleware';
import history from 'connect-history-api-fallback';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const app = express();

const SERVICE_REPORT_URL = process.env.SERVICE_REPORT_URL || 'http://10.144.62.53:8090';
const SERVICE_SCHEDULE_URL = process.env.SERVICE_SCHEDULE_URL || 'http://10.144.62.53:8092';
const SERVICE_STORAGE_URL = process.env.SERVICE_STORAGE_URL || 'http://10.144.62.53:8093';

app.use(
  '/report',
  createProxyMiddleware({
    target: SERVICE_REPORT_URL,
    changeOrigin: true,
    pathRewrite: { '/report': '/api' },
  }),
);

app.use(
  '/schedule',
  createProxyMiddleware({
    target: SERVICE_SCHEDULE_URL,
    changeOrigin: true,
    pathRewrite: { '/schedule': '/api' },
  }),
);

app.use(
  '/storage',
  createProxyMiddleware({
    target: SERVICE_STORAGE_URL,
    changeOrigin: true,
    pathRewrite: { '/storage': '/api' },
  }),
);

// version check
app.use(
  '/version/report',
  createProxyMiddleware({
    target: SERVICE_REPORT_URL,
    changeOrigin: true,
    pathRewrite: () => SERVICE_REPORT_URL + '/vi/health',
  }),
);
app.use(
  '/version/schedule',
  createProxyMiddleware({
    target: SERVICE_SCHEDULE_URL,
    changeOrigin: true,
    pathRewrite: () => SERVICE_SCHEDULE_URL + '/vi/health',
  }),
);
app.use(
  '/version/storage',
  createProxyMiddleware({
    target: SERVICE_STORAGE_URL,
    changeOrigin: true,
    pathRewrite: () => SERVICE_STORAGE_URL + '/vi/health',
  }),
);

// 健康检查
app.get('/vi/health', (req, res) => {
  res.end(`365ms`);
});
// storage
app.get('/env', (req, res) => {
  res.send({
    SERVICE_REPORT_URL,
    SERVICE_SCHEDULE_URL,
    SERVICE_STORAGE_URL,
  });
});

app.use(history()); // 这里千万要注意，要在static静态资源上面
// 托管静态文件
app.use(express.static(__dirname + '/dist'));

// 监听8080端口
app.listen(8080, function () {
  console.log('hi');
});
