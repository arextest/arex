import { app, BrowserWindow, session, globalShortcut } from 'electron';
import { autoUpdateInit } from './autoUpdater';
import path from 'node:path';

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist');
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public');

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

function registerShortcut() {
  globalShortcut.register('Command+T', () => {
    // 向渲染进程发送事件
    win.webContents.sendInputEvent({
      type: 'keyDown',
      keyCode: 't',
      modifiers: ['command'],
    });
  });
  globalShortcut.register('Command+W', () => {
    // 向渲染进程发送事件
    win.webContents.sendInputEvent({
      type: 'keyDown',
      keyCode: 'w',
      modifiers: ['command'],
    });
  });
  globalShortcut.register('Command+Shift+W', () => {
    // 向渲染进程发送事件
    win.webContents.sendInputEvent({
      type: 'keyDown',
      keyCode: 'w',
      modifiers: ['command', 'shift'],
    });
  });
}

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'));
  }

  // 监听主窗口失去焦点事件
  win.on('blur', () => {
    // 取消已注册的所有全局快捷键
    globalShortcut.unregisterAll();
  });

  // 监听主窗口获得焦点事件
  win.on('focus', registerShortcut);

  autoUpdateInit();
}

app.on('window-all-closed', () => {
  win = null;
  // app.quit();
});

app.whenReady().then(createWindow);
