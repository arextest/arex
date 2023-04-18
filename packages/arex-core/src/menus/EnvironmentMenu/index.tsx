import { DeploymentUnitOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';

import { MenusType } from '../../constant';
import { ArexMenuFC, createMenu } from '../index';

const EnvironmentMenu: ArexMenuFC = (props) => {
  return <Button onClick={() => props.onSelect?.('123321')}>EnvironmentMenu</Button>;
};

export default createMenu(EnvironmentMenu, MenusType.ENVIRONMENT, <DeploymentUnitOutlined />);
