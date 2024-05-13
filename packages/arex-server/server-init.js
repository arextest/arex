import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  try {
    fs.rmdirSync(__dirname + '/dist');
    console.log('Removed old dist folder');
  } catch (error) {
    // ignore
  }

  fs.cpSync(path.resolve(__dirname, '../arex/dist'), __dirname + '/dist', { recursive: true });
  console.log('Copied build files from ../arex/dist to ./dist');

  import('dotenv/config');
  console.log('Loaded .env');
  import('./server.js');
} catch (error) {
  console.error('Failed to copy build files from ../arex/dist to ./dist, try run pnpm build first');
  console.error(error);
}
