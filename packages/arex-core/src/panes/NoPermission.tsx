import { StopOutlined } from '@ant-design/icons';
import { Empty, Typography } from 'antd';
import React from 'react';

import NoPermissionSvg from '../../assets/svg/NoAccess.svg';
import { ArexPanesType } from '../constant';
import { createArexPane } from './index';

const NoPermission = () => {
  return (
    <Empty
      image={NoPermissionSvg}
      description={<Typography.Title level={4}>No Permission</Typography.Title>}
      style={{ padding: '16px' }}
    >
      <Typography.Text type='secondary'>
        Sorry, you don&apos;t have permission to access this page.
      </Typography.Text>
    </Empty>
  );
};

export default createArexPane(NoPermission, {
  type: ArexPanesType.NO_PERMISSION,
  icon: <StopOutlined />,
});
