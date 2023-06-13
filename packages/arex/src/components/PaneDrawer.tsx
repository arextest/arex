import { Drawer, DrawerProps } from 'antd';
import React, { FC } from 'react';

export type PaneDrawerProps = {
  noPadding?: boolean;
} & DrawerProps;

const PaneDrawer: FC<PaneDrawerProps> = (props) => (
  <Drawer
    getContainer={false}
    headerStyle={{ padding: '8px' }}
    bodyStyle={{ padding: props.noPadding ? 0 : '8px' }}
    {...props}
  >
    {props.children}
  </Drawer>
);

export default PaneDrawer;
