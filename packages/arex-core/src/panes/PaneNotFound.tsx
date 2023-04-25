import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Empty, Typography } from 'antd';
import React from 'react';

import PageNotFound from '../../assets/svg/PageNotFound.svg';
import { ArexPanesType } from '../constant';
import { ArexPaneFC, createArexPane } from './index';

const PaneNotFound: ArexPaneFC = () => {
  return (
    <Empty
      image={PageNotFound}
      description={<Typography.Title level={4}>Pane Not Found</Typography.Title>}
      style={{ padding: '16px' }}
    >
      <Typography.Text type='secondary'> Please check if PaneType is correct</Typography.Text>
    </Empty>
  );
};

export default createArexPane(PaneNotFound, {
  type: ArexPanesType.PANE_NOT_FOUND,
  icon: <ExclamationCircleOutlined />,
});
