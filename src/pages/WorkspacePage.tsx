import { Tabs } from 'antd';
import React from 'react';

import { CollectionLabel, Overview } from '../components/workspace';

const WorkspaceOverview = () => {
  const item = [
    {
      label: 'Overview',
      key: 'overview',
      children: <Overview />,
    },
    {
      label: 'Labels',
      key: 'labels',
      children: <CollectionLabel />,
    },
  ];
  return <Tabs tabPosition={'left'} items={item} />;
};

export default WorkspaceOverview;
