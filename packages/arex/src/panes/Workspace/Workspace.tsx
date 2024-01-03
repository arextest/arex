import { ArexPaneFC, useTranslation } from '@arextest/arex-core';
import { Tabs } from 'antd';
import React from 'react';

import { PanesType } from '@/constant';
import { useNavPane } from '@/hooks';

import CollectionLabel from './CollectionLabel';
import Overview from './Overview';

const WorkspaceOverview: ArexPaneFC<{ key?: string } | undefined> = (props) => {
  const { data } = props;
  const { t } = useTranslation('components');
  const navPane = useNavPane();

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

  const handleTabChange = (key: string) => {
    navPane({
      type: PanesType.WORKSPACE,
      id: workspaceId,
    });
  };

  return (
    <Tabs
      tabPosition={'left'}
      defaultActiveKey={data?.key}
      items={item}
      onChange={(activeKey) => {
        console.log(activeKey);
      }}
    />
  );
};

export default WorkspaceOverview;
