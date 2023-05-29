import {createProxyMiddleware} from 'http-proxy-middleware'
import history from 'connect-history-api-fallback'
import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const app = express();


app.use(
  '/report',
  createProxyMiddleware({
    target: process.env.SERVICE_REPORT_URL,
    changeOrigin: true,
    pathRewrite: { '/report': '/api' },
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

app.use(
  '/storage',
  createProxyMiddleware({
    target: process.env.SERVICE_STORAGE_URL,
    changeOrigin: true,
    pathRewrite: { '/storage': '/api' },
  }),
);

app.use(
  '/node',
  createProxyMiddleware({
    target: process.env.SERVICE_NODE_URL,
    changeOrigin: true,
    pathRewrite: { '/node': '/' },
  }),
);


// 健康检查
app.get('/vi/health', (req, res) => {
  res.end(`365ms`);
});
// storage
app.get('/env', (req, res) => {
  res.send({
    SERVICE_REPORT_URL: process.env.SERVICE_REPORT_URL,
    SERVICE_CONFIG_URL: process.env.SERVICE_CONFIG_URL,
    SERVICE_SCHEDULE_URL: process.env.SERVICE_SCHEDULE_URL,
    SERVICE_STORAGE_URL: process.env.SERVICE_STORAGE_URL,
    SERVICE_NODE_URL:process.env.SERVICE_NODE_URL
  });
});

app.use(history()); // 这里千万要注意，要在static静态资源上面
// 托管静态文件
app.use(express.static(__dirname+'/dist'));

// 监听8080端口
app.listen(8080, function () {
  console.log('hi');
});
