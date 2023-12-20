import React from 'react';

import { ArexPanesType } from '../constant';
import NoPermission from './NoPermission';
import PaneNotFound from './PaneNotFound';
import WebView from './WebView';

export type Pane<D extends PanesData = PanesData> = {
  // PaneId
  id: string;
  // PaneType
  type: string;
  // unique, generate by id and types
  key?: string;
  // PaneName
  name?: string | false;
  // antd icon name
  icon?: string;
  // The newer the pane, the larger the index
  index?: number;
  // TODO: pane edit detection
  dirty?: boolean;
  data?: D;
};

export type ArexPaneOptions = {
  icon?: React.ReactNode;
  type: string;
  menuType?: string;
  noPadding?: boolean;
};

export type ArexPane<D extends PanesData = PanesData> = ArexPaneFC<D> & ArexPaneOptions;

export type ArexPaneFC<D extends PanesData = PanesData> = React.FC<{ data: D; paneKey: string }>;

export type PanesData = any;

export function createArexPane<D extends PanesData>(
  Pane: ArexPaneFC<D>,
  options: ArexPaneOptions,
): ArexPane<D> {
  const { noPadding = false } = options;
  return Object.assign(Pane, { ...options, noPadding });
}

export const ArexPanes: Record<string, ArexPane> = {
  [ArexPanesType.PANE_NOT_FOUND]: PaneNotFound,
  [ArexPanesType.NO_PERMISSION]: NoPermission,
  [ArexPanesType.WEB_VIEW]: WebView,
};
