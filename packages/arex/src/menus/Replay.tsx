import { HistoryOutlined } from '@ant-design/icons';
import { ArexMenuFC, createArexMenu } from '@arextest/arex-core';
import { useSize } from 'ahooks';
import React from 'react';

import { AppMenu } from '@/components';
import { MenusType, PanesType } from '@/constant';
import { useMenusPanes } from '@/store';

const ReplayMenu: ArexMenuFC = (props) => {
  const size = useSize(() => document.getElementById('arex-menu-wrapper'));
  const { activePane } = useMenusPanes();

  return (
    <AppMenu
      {...props}
      value={activePane?.type === PanesType.REPLAY ? props.value : undefined}
      height={size && size?.height - 88}
    />
  );
};

export default createArexMenu(ReplayMenu, {
  type: MenusType.REPLAY,
  paneType: PanesType.REPLAY,
  icon: <HistoryOutlined />,
});
