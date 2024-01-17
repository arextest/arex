import { css, Segmented, useTranslation } from '@arextest/arex-core';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Tabs } from 'antd';
import React, { FC, useState } from 'react';

import MultiEnvironment from './MultiEnvironment';
import Standard from './Standard';

type RecordSettingProps = {
  appId: string;
};
const RecordSetting: FC<RecordSettingProps> = (props) => {
  const [activeKey, setActiveKey] = useState('standard');
  const { t } = useTranslation('components');

  const optionsItems = [
    {
      key: 'standard',
      value: 'standard',
      label: '标准',
      children: <Standard key='standard' appId={props.appId} />,
    },
    {
      key: 'multiEnvironment',
      value: 'multiEnvironment',
      label: '多环境',
      children: <MultiEnvironment key='multiEnvironment' appId={props.appId} />,
    },
  ];

  return (
    <>
      <Segmented
        block
        value={activeKey}
        options={optionsItems}
        onChange={(value) => setActiveKey(value as string)}
        style={{ margin: '0 8px 8px' }}
      />

      <Tabs
        activeKey={activeKey}
        items={optionsItems}
        css={css`
          .ant-tabs-nav {
            display: none;
          }
        `}
      />
    </>
  );
};

export default RecordSetting;
