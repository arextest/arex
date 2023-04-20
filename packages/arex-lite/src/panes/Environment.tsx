import { DeploymentUnitOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ArexPaneFC, createArexPane } from 'arex-core';
import React from 'react';

import { MenusType, PanesType } from '../constant';

export type EnvironmentPanesData = {
  value: string;
};

export type EnvironmentKeyValues = { key: string; value: string; active?: boolean };

const Environment: ArexPaneFC<EnvironmentPanesData> = (props) => {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <div>props.value: {props.data?.value}</div>
      <span>count: {count}</span>
      <Button onClick={() => setCount((count) => count + 1)}>add</Button>
    </div>
  );
};

export default createArexPane(Environment, {
  type: PanesType.ENVIRONMENT,
  menuType: MenusType.ENVIRONMENT,
  icon: <DeploymentUnitOutlined />,
});
