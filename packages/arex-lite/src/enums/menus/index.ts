import { FC, ReactNode } from 'react';

export enum MenusType {
  Collection = 'collection',
  Replay = 'replay',
  AppSetting = 'appSetting',
  Environment = 'environment',
  Setting = 'setting',
}

export type MenuConfig = {
  key: string;
  label: string;
  icon: ReactNode;
  Menu?: FC;
  children?: MenuConfig[];
};

export const defaultActiveMenu = MenusType.Environment;
export const MAX_PANES_COUNT = 8;
