import { t } from 'i18next';
import { FC, ReactNode } from 'react';

export type MenuConfig = {
  key: string;
  label: string;
  icon: ReactNode;
  Menu?: FC;
  children?: MenuConfig[];
};

export type ArexMenuFC = FC<{
  value?: string;
  onSelect?: (value: string) => void;
  [key: string]: any;
}>;

export type ArexMenu = ArexMenuFC & {
  menuName: string;
  type: string;
  paneType: string;
  icon?: ReactNode;
  children?: ArexMenu[];
};

/**
 * 创建菜单
 * @param Menu
 * @param options
 */
export function createArexMenu(
  Menu: ArexMenuFC,
  options: {
    type: string;
    paneType: string;
    icon?: ReactNode;
    i18?: {
      prefix?: string;
      ns?: string;
    };
  },
) {
  const { type, paneType, icon, i18 = {} } = options;
  const { prefix = 'arexMenu', ns } = i18;
  return Object.assign(Menu, {
    get menuName() {
      return t(`${prefix}.${type}`, { ns });
    },
    type,
    paneType,
    icon,
  });
}
