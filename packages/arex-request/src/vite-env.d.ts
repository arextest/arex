/// <reference types="vite/client" />
import { MessageInstance } from 'antd/es/message/interface';

declare global {
  interface Window {
    message: MessageInstance;
    __AREX_EXTENSION_INSTALLED__: boolean; // 是否安装了arex-chrome-extension
    __AREX_EXTENSION_VERSION__: string; // arex-chrome-extension 最新版本号
  }
}
