import { ArexPaneFC, useArexPaneProps, useTranslation } from '@arextest/arex-core';
import { Tabs } from 'antd';
import React from 'react';

import { PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { decodePaneKey } from '@/store/useMenusPanes';

import CollectionLabel from './CollectionLabel';
import Overview from './Overview';

const WorkspaceOverview: ArexPaneFC<{ key?: string } | undefined> = (props) => {
  const { data } = props;
  const { paneKey } = useArexPaneProps();
  const { id: workspaceId } = decodePaneKey(paneKey);

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
      data: {
        key,
      },
    });
  };

  return (
    <Tabs
      tabPosition={'left'}
      defaultActiveKey={data?.key}
      items={item}
      onChange={handleTabChange}
    />
  );
};

export default WorkspaceOverview;
