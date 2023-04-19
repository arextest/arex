import { t } from 'i18next';
import React from 'react';

import { PanesType } from '../constant';
import Environment, { EnvironmentPanesData } from './Environment';

/**
 * All components under panes folder should be defined using PanesFC
 */
export type ArexPane<D extends PanesData = PanesData> = ArexPaneFC<D> & {
  name: string;
  icon?: React.ReactNode;
  type: string;
  menuType?: string;
};

export type ArexPaneFC<D extends PanesData = PanesData> = React.FC<{ data: D }>;

export type PanesData = EnvironmentPanesData;

export function createPane<D extends PanesData>(
  Pane: ArexPaneFC<D>,
  type: string,
  menuType?: string,
  icon?: React.ReactNode,
): ArexPane<D> {
  return Object.assign(Pane, {
    get paneName() {
      return t(type);
    },
    type,
    menuType,
    icon,
  });
}

export const ArexPanes: Record<string, ArexPane> = {
  [PanesType.ENVIRONMENT]: Environment,
};

export default ArexPanes;
export type { EnvironmentPanesData };
