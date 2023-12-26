import { join } from 'path';
import fs from 'fs';
import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import * as fzstd from 'fzstd';

const dataPath = join(app.getPath('userData'), 'data.json');
const configPath = join(app.getPath('userData'), 'config.json');

export function getLocalData(key?: string) {
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify({}), { encoding: 'utf-8' });
  }
  let data = fs.readFileSync(dataPath, { encoding: 'utf-8' });
  let json = JSON.parse(data);
  return key ? json[key] : json;
}

export function getConfigData(key?: string) {
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({}), { encoding: 'utf-8' });
  }
  let data = fs.readFileSync(configPath, { encoding: 'utf-8' });
  let json = JSON.parse(data);
  return key ? json[key] : json;
}

export function setLocalData(key: string | object, value?: any) {
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify({}), { encoding: 'utf-8' });
  }
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

export function base64ToBytes(base64: string): Uint8Array {
  const binString: ArrayLike<string> = atob(base64);
  return Uint8Array.from<string>(binString, (m: string) => m.codePointAt(0)!);
}

export function bytesToBase64(bytes: Uint8Array) {
  const binString = Array.from(bytes, (x) => String.fromCodePoint(x)).join('');
  return btoa(binString);
}

export async function zstdDecompress(str: string) {
  const decompressed_data = fzstd.decompress(base64ToBytes(str));
  return new TextDecoder().decode(decompressed_data);
}
