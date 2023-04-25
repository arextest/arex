/// <reference types="vite/client" />
import { MessageInstance } from 'antd/es/message/interface';

declare global {
  interface Window {
    message: MessageInstance;
  }
}
