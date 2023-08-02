import { HistoryOutlined } from '@ant-design/icons';
import { createArexMenu } from '@arextest/arex-core';
import { useSize } from 'ahooks';
import React from 'react';

import { AppMenu } from '@/components';
import { MenusType, PanesType } from '@/constant';

export default createArexMenu(
  (props) => {
    const size = useSize(() => document.getElementById('arex-menu-wrapper'));
    return <AppMenu {...props} height={size && size?.height - 88} />;
  },
  {
    type: MenusType.REPLAY,
    paneType: PanesType.REPLAY,
    icon: <HistoryOutlined />,
  },
);
