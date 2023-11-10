import express from 'express';
import logger from 'electron-log';

import port from '../config/port.json';

const authServer = express();

export function oauth(callback: (path: string, code: string) => void) {
  authServer.get('/oauth/*', async (req, res) => {
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

authServer.listen(port.authPort, () => {
  logger.log(`Oauth server running at http://localhost:${port.authPort}`);
});
