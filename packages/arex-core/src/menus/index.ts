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

export const ArexMenu = {
  [MenusType.ENVIRONMENT]: EnvironmentMenu,
};

export default ArexMenu;
