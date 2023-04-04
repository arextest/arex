import React, { FC } from 'react';

import { MenusType, PanesType } from '../constant';
import Environment, { EnvironmentPanesData } from './Environment';
import Request from './Request';

export type PanesProps<D extends PanesData = undefined, P = unknown> = P & {
  page: PanesFC<D>;
};

/**
 * All components under panes folder should be defined using PanesFC
 */
export type PanesFC<D extends PanesData = undefined, P = unknown> = FC<PanesProps<D, P>>;
// export interface IBlock<T extends IBlockData = IBlockData> {
//   name: string;
//   type: string;
//   create: (payload?: RecursivePartial<T>) => T;
//   validParentType: string[];
//   render: (params: {
//     data: T;
//     idx?: string | null;
//     mode: 'testing' | 'production';
//     context?: IPage;
//     dataSource?: { [key: string]: any };
//     children?: React.ReactNode;
//     keepClassName?: boolean;
//     renderPortal?: (
//       props: Omit<Parameters<IBlock<T>['render']>[0], 'renderPortal'> & {
//         refEle: HTMLElement;
//       },
//     ) => React.ReactNode;
//   }) => React.ReactNode;
// }

export type PanesTypeType = { [type: string]: PanesType };

export type PanesData =
  | undefined
  // | nodeType // PanesTypeEnum.Request 时的数据
  | EnvironmentPanesData;

export type ArexPanesType<D extends PanesData = undefined> = {
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

export const ArexPanes = {
  [PanesType.REQUEST]: Request,
  [PanesType.ENVIRONMENT]: Environment,
};

export default ArexPanes;
export type { EnvironmentPanesData };
