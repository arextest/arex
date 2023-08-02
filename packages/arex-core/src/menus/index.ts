import { FC, PropsWithChildren, ReactNode } from 'react';

export type MenuConfig = {
  key: string;
  label: string;
  icon: ReactNode;
  Menu?: FC;
};

export type ArexMenuProps<T> = {
  value?: string;
  onSelect?: (value: string, data?: unknown) => void;
} & PropsWithChildren<T>;

export type ArexMenuFC<T = unknown> = FC<ArexMenuProps<T>>;

export type ArexMenu<T> = ArexMenuFC<T> & {
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
  Menu: ArexMenuFC<unknown>,
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
