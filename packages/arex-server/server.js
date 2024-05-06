import { createProxyMiddleware } from 'http-proxy-middleware';
import history from 'connect-history-api-fallback';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const PORT = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 8080;
const SERVICE_API_URL = process.env.SERVICE_API_URL;
const SERVICE_SCHEDULE_URL = process.env.SERVICE_SCHEDULE_URL;
const SERVICE_STORAGE_URL = process.env.SERVICE_STORAGE_URL;

if (!SERVICE_API_URL || !SERVICE_SCHEDULE_URL || !SERVICE_STORAGE_URL) {
  throw new Error('SERVICE_API_URL, SERVICE_SCHEDULE_URL, SERVICE_STORAGE_URL are required');
}

app.use(
  '/webApi',
  createProxyMiddleware({
    target: SERVICE_API_URL,
    changeOrigin: true,
    pathRewrite: { '/webApi': '/api' },
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
  '/version/webApi',
  createProxyMiddleware({
    target: SERVICE_API_URL,
    changeOrigin: true,
    pathRewrite: () => SERVICE_API_URL + '/vi/health',
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

// health check
app.get('/vi/health', (req, res) => {
  res.end(`365ms`);
});

app.get('/env', (req, res) => {
  res.send({
    SERVICE_API_URL,
    SERVICE_SCHEDULE_URL,
    SERVICE_STORAGE_URL,
  });
});

// should be done before express.static
app.use(history());
// redirect to index.html
app.use(express.static(__dirname + '/dist'));

app.listen(PORT, function () {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
