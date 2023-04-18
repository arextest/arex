import { Button } from 'antd';
import React from 'react';

import { ArexMenuFC, createMenu } from '../index';

const EnvironmentMenu: ArexMenuFC = (props) => {
  return <Button onClick={() => props.onSelect?.('123321')}>EnvironmentMenu</Button>;
};

export default createMenu(EnvironmentMenu, 'Environment');
