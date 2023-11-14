import express from 'express';
import logger from 'electron-log';
import { createProxyMiddleware } from 'http-proxy-middleware';

import port from '../config/port.json';
import proxy from '../config/proxy.json';

const server = express();

export function oauth(callback: (path: string, code: string) => void) {
  server.get('/oauth/*', async (req, res) => {
    try {
      logger.log(`login from ${req.path}`);
      callback(req.path, req.query.code as string);
      res.send('Login successful! You can close this window now.');
    } catch (error) {
      logger.error('Error occurred during login.');
      res.status(500).send('Error occurred during login.');
    }
  });
}

server.listen(port.electronPort, () => {
  logger.log(`Electron server running at http://localhost:${port.electronPort}`);
});

proxy.forEach((item) => {
  server.use(
    item.path,
    createProxyMiddleware({
      target: process.env.SERVICE_REPORT_URL || item.target,
      changeOrigin: true,
      pathRewrite: { [item.path]: '/' },
    }),
  );
});

// 健康检查
server.get('/vi/health', (req, res) => {
  res.end(`365ms`);
});

server.get('/env', (req, res) => {
  res.send({
    SERVICE_REPORT_URL: process.env.SERVICE_REPORT_URL,
    SERVICE_SCHEDULE_URL: process.env.SERVICE_SCHEDULE_URL,
    SERVICE_STORAGE_URL: process.env.SERVICE_STORAGE_URL,
  });
});
