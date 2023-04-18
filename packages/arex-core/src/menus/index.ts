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
  menuName: string;
  type: string;
  paneType: string;
  icon?: ReactNode;
  children?: ArexMenu[];
};

export function createMenu(Menu: ArexMenuFC, type: string, icon?: ReactNode) {
  return Object.assign(Menu, {
    get menuName() {
      return t(`arexMenu.${type}`);
    },
    type,
    paneType: type,
    icon,
  });
}

export const ArexMenus: Record<string, ArexMenu> = {
  [MenusType.ENVIRONMENT]: EnvironmentMenu,
};

export default ArexMenus;
