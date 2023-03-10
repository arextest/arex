/// <reference types="vite/client" />
import React, { FC, PropsWithChildren } from 'react';

export type ReactFCWithChildren = React.FC<PropsWithChildren>;

// Custom Type for a React functional component with props AND CHILDREN
export type FCC<P> = FC<PropsWithChildren<P>>;

declare global {
  interface Window {
    __AREX_EXTENSION_INSTALLED__: boolean; // 是否安装了arex-chrome-extension
    __AREX_EXTENSION_VERSION__: string; // arex-chrome-extension 最新版本号
    __AREX_DESKTOP_AGENT__: boolean; //是否安装了arex桌面代理
  }
}
