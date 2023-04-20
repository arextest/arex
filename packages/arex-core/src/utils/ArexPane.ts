import { t } from 'i18next';
import React from 'react';

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

export type PanesData = any;

export function createArexPane<D extends PanesData>(
  Pane: ArexPaneFC<D>,
  options: {
    type: string;
    menuType?: string;
    icon?: React.ReactNode;
    i18?: {
      prefix?: string;
      ns?: string;
    };
  },
): ArexPane<D> {
  const { type, menuType, icon, i18 = {} } = options;
  const { prefix = 'arexPane', ns } = i18;
  return Object.assign(Pane, {
    get paneName() {
      return t(`${prefix}.${type}`, { ns });
    },
    type,
    menuType,
    icon,
  });
}
