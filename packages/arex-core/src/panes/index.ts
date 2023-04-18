import { t } from 'i18next';
import React from 'react';

import { MenusType, PanesType } from '../constant';
import Environment, { EnvironmentPanesData } from './Environment';

/**
 * All components under panes folder should be defined using PanesFC
 */
export type ArexPane<D extends PanesData = PanesData> = ArexPaneFC<D> & {
  name: string;
  type: string;
  menuType?: string;
};

export type ArexPaneFC<D extends PanesData = PanesData> = React.FC<{ data: D }>;

export type PanesTypeType = { [type: string]: PanesType };

export type PanesData =
  // | nodeType // PanesTypeEnum.Request 时的数据
  EnvironmentPanesData;

export type ArexPanesType<D extends PanesData> = {
  title: string;
  key?: string;
  menuType?: MenusType;
  pageType: PanesType;
  isNew?: boolean;
  data: D;
  sortIndex?: number;
  paneId: string;
  rawId: React.Key;
};

export function createPane<D extends PanesData>(
  Pane: ArexPaneFC<D>,
  type: string,
  menuType?: string,
): ArexPane<D> {
  return Object.assign(Pane, {
    get paneName() {
      return t(type);
    },
    type,
    menuType,
  });
}

export const ArexPanes: Record<string, ArexPane> = {
  [PanesType.ENVIRONMENT]: Environment,
};

export default ArexPanes;
export type { EnvironmentPanesData };
