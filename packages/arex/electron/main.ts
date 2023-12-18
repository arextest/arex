import './logger';

import { app, BrowserWindow, dialog, globalShortcut, Menu } from 'electron';
import { autoUpdateInit } from './autoUpdater';
import path from 'node:path';
import { oauth } from './server';
import { openWindow } from './helper';
import process from 'process';

process.env.DIST = path.join(__dirname, '../dist');
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public');

let win: BrowserWindow | null;

// Menu.setApplicationMenu(null);

function createWindow() {
  win = new BrowserWindow({
    titleBarStyle: process.platform === 'darwin' ? 'customButtonsOnHover' : 'default',
    frame: process.platform !== 'darwin',
    width: 1080,
    height: 720,
    icon: path.join(process.env.PUBLIC, 'logo.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
      webviewTag: true,
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }

  openWindow(win);

  // 监听主窗口失去焦点事件
  win.on('blur', () => {
    // 取消已注册的所有全局快捷键
    globalShortcut.unregisterAll();
  });

  // 监听主窗口获得焦点事件
  win.on('focus', () => {
    globalShortcut.registerAll(['f5', 'CommandOrControl+R'], () => {
      //win.reload()
    });
  });
}

app.on('window-all-closed', () => {
  win = null;
  // if (process.platform !== 'darwin')
  app.quit();
});

app.whenReady().then(() => {
  createWindow();
  autoUpdateInit();
  oauth((pathname, code) => {
    openWindow(win, `${pathname}?code=${code}`);
  });
});
