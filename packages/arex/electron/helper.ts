import { join } from 'path';
import fs from 'fs';
import { app, BrowserWindow } from 'electron';
import path from 'node:path';
const dataPath = join(app.getPath('userData'), 'data.json');

export function getLocalData(key?: string) {
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify({}), { encoding: 'utf-8' });
  }
  let data = fs.readFileSync(dataPath, { encoding: 'utf-8' });
  let json = JSON.parse(data);
  return key ? json[key] : json;
}

export function setLocalData(key: string | object, value?: any) {
  let args = [...arguments];
  let data = fs.readFileSync(dataPath, { encoding: 'utf-8' });
  let json = JSON.parse(data);
  if (args.length === 0 || args[0] === null) {
    json = {};
  } else if (args.length === 1 && typeof key === 'object' && key) {
    json = {
      ...json,
      ...args[0],
    };
  } else if (typeof key === 'string') {
    json[key] = value;
  }
  fs.writeFileSync(dataPath, JSON.stringify(json), { encoding: 'utf-8' });
}

export async function sleep(ms: number) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve(undefined);
      clearTimeout(timer);
    }, ms);
  });
}

export function openWindow(win: BrowserWindow, pathname?: string) {
  const devServerUrl = process.env.VITE_DEV_SERVER_URL?.slice(0, -1);
  if (!!devServerUrl) {
    win.loadURL(`${devServerUrl}${pathname ?? ''}`);
  } else {
    // win.loadFile('dist/index.html');
    win.loadFile(path.join(process.env.DIST, `index.html`), {
      hash: pathname,
    });
  }
}
