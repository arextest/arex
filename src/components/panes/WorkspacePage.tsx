import { Tabs } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { CollectionLabel, Overview } from '../workspace';

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
