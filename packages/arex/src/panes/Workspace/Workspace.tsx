import { ArexPaneFC, useTranslation } from '@arextest/arex-core';
import { Tabs } from 'antd';
import React from 'react';

import CollectionLabel from './CollectionLabel';
import Overview from './Overview';

const WorkspaceOverview: ArexPaneFC<{ key?: string }> = (props) => {
  const { data } = props;
  const { t } = useTranslation('components');

  const item = [
    {
      label: t('workSpace.overview'),
      key: 'overview',
      children: <Overview />,
    },
    {
      label: t('workSpace.labels'),
      key: 'labels',
      children: <CollectionLabel />,
    },
  ];
  return <Tabs tabPosition={'left'} defaultActiveKey={data.key} items={item} />;
};

export default WorkspaceOverview;
