import React, { FC } from 'react';

import { MenusType, PanesType } from '../constant';
import Environment, { EnvironmentPanesData } from './Environment';

export type PanesProps<D extends PanesData, P = unknown> = P & {
  page: PanesFC<D>;
};

/**
 * All components under panes folder should be defined using PanesFC
 */
export type PanesFC<D extends PanesData = PanesData, P = unknown> = FC<PanesProps<D, P>>;
export interface ArexPane<T extends PanesData = PanesData> {
  name: string;
  type: string;
  render: ArexPanePC<T>;
}
export type ArexPanePC<T extends PanesData> = (props: {
  data: T;
  idx?: string | null;
  mode?: 'test' | 'production';
  children?: React.ReactNode;
}) => React.ReactNode;

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

export const ArexPanes: Record<string, ArexPane> = {
  [PanesType.ENVIRONMENT]: Environment,
};

export default ArexPanes;
export type { EnvironmentPanesData };
