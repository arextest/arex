import { t } from 'i18next';
import { FC, ReactNode } from 'react';

import { MenusType } from '../constant';
import EnvironmentMenu from './EnvironmentMenu';

export type MenuConfig = {
  key: string;
  label: string;
  icon: ReactNode;
  Menu?: FC;
  children?: MenuConfig[];
};

export type ArexMenuFC = FC<{
  value?: string;
  onSelect: (value: string) => void;
  [key: string]: any;
}>;

export type ArexMenu = ArexMenuFC & {
  name: string;
  type: string;
  paneType: string;
};

export function createMenu(Menu: ArexMenuFC, type: string) {
  return Object.assign(Menu, {
    get menuName() {
      return t(type);
    },
    type,
    paneType: type,
  });
}

export const ArexMenus: Record<string, ArexMenu> = {
  [MenusType.ENVIRONMENT]: EnvironmentMenu,
};

export default ArexMenus;
