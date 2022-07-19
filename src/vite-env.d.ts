/// <reference types="vite/client" />
import React, { FC, PropsWithChildren } from "react";

export type PropsWithChildrenOnly = PropsWithChildren<unknown>;
export type ReactFCWithChildren = React.FC<PropsWithChildrenOnly>;

// Custom Type for a React functional component with props AND CHILDREN
export type FCC<P = {}> = FC<PropsWithChildren<P>>;

declare global {
  interface Window {
    __AREX_EXTENSION_INSTALLED__: boolean; // 是否安装了arex-chrome-extension
  }
}

interface NodeList {
  id: string;
  children: NodeList[];
  title: string;
  key: string;
  nodeType: number;
}
