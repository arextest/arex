import { FC, ReactNode } from 'react';

export type MenuConfig = {
  key: string;
  label: string;
  icon: ReactNode;
  Menu?: FC;
};

export type ArexMenuFC = FC<{
  value?: string;
  onSelect?: (value: string) => void;
  [key: string]: any;
}>;

export type ArexMenu = ArexMenuFC & {
  type: string;
  paneType: string;
  icon?: ReactNode;
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
  },
) {
  const { type, paneType, icon } = options;
  return Object.assign(Menu, {
    type,
    paneType,
    icon,
  });
}
