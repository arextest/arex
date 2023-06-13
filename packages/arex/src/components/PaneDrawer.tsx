import { Drawer, DrawerProps } from 'antd';
import { FC } from 'react';

const PaneDrawer: FC<DrawerProps> = (props) => (
  <Drawer headerStyle={{ padding: '8px' }} bodyStyle={{ padding: 0 }} {...props}>
    {props.children}
  </Drawer>
);

export default PaneDrawer;
