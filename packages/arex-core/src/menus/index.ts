import { FC, PropsWithChildren, ReactNode } from 'react';

export type MenuConfig = {
  key: string;
  label: string;
  icon: ReactNode;
  Menu?: FC;
};

export interface ArexMenuProps extends PropsWithChildren {
  value?: string;
  onSelect?: (value: string, data?: unknown) => void;
}

export type ArexMenuFC = FC<ArexMenuProps>;

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
