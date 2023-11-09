import express from 'express';
import proxy from '../config/port.json';
const authServer = express();

export function oauth(callback: (path: string, code: string) => void) {
  authServer.get('/oauth/*', async (req, res) => {
    try {
      callback(req.path, req.query.code as string);
      res.send('Login successful! You can close this window now.');
    } catch (error) {
      res.status(500).send('Error occurred during login.');
    }
  });
}

authServer.listen(proxy.authPort, () => {
  console.log(`Oauth server running at http://localhost:${proxy.authPort}`);
});
