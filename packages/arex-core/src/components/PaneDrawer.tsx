import { Drawer, DrawerProps } from 'antd';
import React, { FC } from 'react';

import { useArexPaneProps } from '../hooks';

const PaneDrawer: FC<DrawerProps> = (props) => {
  const { paneKey } = useArexPaneProps();

  return (
    <Drawer
      getContainer={() => document.getElementById(`arex-pane-wrapper-${paneKey}`) as Element}
      {...props}
      rootStyle={{ position: 'absolute', ...props.rootStyle }}
    >
      {props.children}
    </Drawer>
  );
};

export default PaneDrawer;
