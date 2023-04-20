import { DeploymentUnitOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ArexMenuFC, createArexMenu } from 'arex-core';
import React from 'react';

import { MenusType, PanesType } from '../constant';

const Environment: ArexMenuFC = (props) => {
  return <Button onClick={() => props.onSelect?.('123321')}>EnvironmentMenu</Button>;
};

export default createArexMenu(Environment, {
  type: MenusType.ENVIRONMENT,
  paneType: PanesType.ENVIRONMENT,
  icon: <DeploymentUnitOutlined />,
});
