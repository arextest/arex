import { FileOutlined } from '@ant-design/icons';
import { ArexPaneFC, createPane } from 'arex-core';
import { PanesType } from 'arex-core';
import React from 'react';

const Demo: ArexPaneFC = (props) => {
  return <>DemoPane</>;
};

export default createPane(
  Demo,
  // PanesType.DEMO
  'Demo',
  undefined,
  <FileOutlined />,
);
