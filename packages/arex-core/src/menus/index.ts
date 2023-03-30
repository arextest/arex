import { FC, ReactNode } from 'react';

import { MenusType } from '../constant';
import CollectionMenu from './CollectionMenu';
import EnvironmentMenu from './EnvironmentMenu';

export type MenuConfig = {
  key: string;
  label: string;
  icon: ReactNode;
  Menu?: FC;
  children?: MenuConfig[];
};

const ArexMenu = {
  [MenusType.COLLECTION]: CollectionMenu,
  [MenusType.ENVIRONMENT]: EnvironmentMenu,
};

export default ArexMenu;
