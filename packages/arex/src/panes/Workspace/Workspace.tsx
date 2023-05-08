import { Tabs } from 'antd';
import { useTranslation } from 'arex-core';
import React from 'react';

import CollectionLabel from './CollectionLabel';
import Overview from './Overview';

const WorkspaceOverview = () => {
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
  return <Tabs tabPosition={'left'} items={item} />;
};

export default WorkspaceOverview;
