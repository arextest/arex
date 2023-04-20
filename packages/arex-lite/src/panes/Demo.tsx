import { FileOutlined } from '@ant-design/icons';
import { ArexPaneFC, createArexPane } from 'arex-core';
import React from 'react';

import { PanesType } from '../constant';

const Demo: ArexPaneFC = (props) => {
  return <>DemoPane</>;
};

export default createArexPane(Demo, {
  type: PanesType.DEMO,
  icon: <FileOutlined />,
});
