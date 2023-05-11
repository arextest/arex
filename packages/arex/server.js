import {createProxyMiddleware} from 'http-proxy-middleware'
import history from 'connect-history-api-fallback'
import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const app = express();
const e = {
  SERVICE_REPORT_URL:"http://10.5.153.1:8090",
  SERVICE_SCHEDULE_URL:"http://10.5.153.1:8092",
  SERVICE_STORAGE_URL:"http://10.5.153.1:8093",
  SERVICE_NODE_URL:"http://10.5.153.1:10001"
}
app.use(
  '/report',
  createProxyMiddleware({
    target: e.SERVICE_REPORT_URL,
    changeOrigin: true,
    pathRewrite: { '/report': '/api' },
  }),
);

app.use(
  '/schedule',
  createProxyMiddleware({
    target: e.SERVICE_SCHEDULE_URL,
    changeOrigin: true,
    pathRewrite: { '/schedule': '/api' },
  }),
);

app.use(
  '/storage',
  createProxyMiddleware({
    target: e.SERVICE_STORAGE_URL,
    changeOrigin: true,
    pathRewrite: { '/storage': '/api' },
  }),
);

app.use(
  '/node',
  createProxyMiddleware({
    target: e.SERVICE_NODE_URL,
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
    SERVICE_REPORT_URL: e.SERVICE_REPORT_URL,
    SERVICE_CONFIG_URL: e.SERVICE_CONFIG_URL,
    SERVICE_SCHEDULE_URL: e.SERVICE_SCHEDULE_URL,
    SERVICE_STORAGE_URL: e.SERVICE_STORAGE_URL,
    SERVICE_NODE_URL:e.SERVICE_NODE_URL
  });
});

app.use(history()); // 这里千万要注意，要在static静态资源上面
// 托管静态文件
app.use(express.static(__dirname+'/dist'));

// 监听8080端口
app.listen(8080, function () {
  console.log('hi');
});
