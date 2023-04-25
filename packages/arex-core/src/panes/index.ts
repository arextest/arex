import React, { ReactNode } from 'react';

import { ArexPanesType } from '../constant';
import NoPermission from './NoPermission';
import PaneNotFound from './PaneNotFound';

export type Pane<D extends PanesData = PanesData> = {
  id: string; // PaneId
  type: string; // PaneType
  key?: string; // unique, generate by id and type
  icon?: string; // antd icon name
  index?: number; // 越新的 pane, index 越大
  dirty?: boolean;
  data?: D;
};

export type ArexPane<D extends PanesData = PanesData> = ArexPaneFC<D> & {
  icon?: React.ReactNode;
  type: string;
  menuType?: string;
};

export type ArexPaneFC<D extends PanesData = PanesData> = React.FC<{ data: D }>;

export type PanesData = any;

export function createArexPane<D extends PanesData>(
  Pane: ArexPaneFC<D>,
  options: {
    type: string;
    menuType?: string;
    icon?: React.ReactNode;
  },
): ArexPane<D> {
  const { type, menuType, icon } = options;
  return Object.assign(Pane, {
    type,
    menuType,
    icon,
  });
}

export const ArexPanes: Record<string, ArexPane> = {
  [ArexPanesType.PANE_NOT_FOUND]: PaneNotFound,
  [ArexPanesType.NO_PERMISSION]: NoPermission,
};
