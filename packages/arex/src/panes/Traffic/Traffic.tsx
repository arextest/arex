import { ArexPaneFC, css } from '@arextest/arex-core';
import { Card, Space, Table, theme } from 'antd';
import React, { useMemo } from 'react';
import Tree from 'react-d3-tree';

import { decodePaneKey } from '@/store/useMenusPanes';

import CallChain from './CallChain';
import TrafficList from './TrafficList';

const Traffic: ArexPaneFC = (props) => {
  const { id: appId } = useMemo(() => decodePaneKey(props.paneKey), [props.paneKey]);

  return (
    <>
      <CallChain />
      <TrafficList />
    </>
  );
};

export default Traffic;
