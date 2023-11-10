/// <reference types="vite/client" />
import { Pane } from '@arextest/arex-core';
import { MessageInstance } from 'antd/es/message/interface';

import { AREX_OPEN_NEW_PANEL } from '@/constant';

declare global {
  const __APP_VERSION__: string;
  const __AUTH_PORT__: string;
  interface Window {
    monaco: any;
    message: MessageInstance;
    ipcMain: import('electron').IpcMain;
    shell: import('electron').Shell;
    platform: 'darwin' | 'win32' | 'linux' | undefined;
    __locale__: string;
    __AREX_EXTENSION_INSTALLED__: boolean; // 是否安装了arex-chrome-extension
    __AREX_EXTENSION_VERSION__: string; // arex-chrome-extension 最新版本号
    __AREX_DESKTOP_AGENT__: boolean; //是否安装了arex桌面代理
  }

  // custom event types
  interface WindowEventMap {
    [AREX_OPEN_NEW_PANEL]: CustomEvent<Pane>;
  }
}
