import { CaretUpOutlined } from '@ant-design/icons';
import { useTranslation } from '@arextest/arex-core';
import { css } from '@emotion/react';
import { Collapse, Divider, Space } from 'antd';
import React, { FC, useState } from 'react';

import CallbackUrl from './CallbackUrl';
import DataDesensitization from './DataDesensitization';
import SystemLogs from './SystemLogs';

const Advanced: FC = () => {
  const { t } = useTranslation();
  const [expand, setExpand] = useState(false);

  return (
    <Collapse
      ghost
      activeKey={expand ? ['advanced'] : []}
      items={[
        {
          key: 'advanced',
          showArrow: false,
          label: (
            <Divider orientation='left'>
              {t('advanced')} <CaretUpOutlined rotate={expand ? 180 : 0} />
            </Divider>
          ),
          children: (
            <Space direction='vertical' size='middle'>
              <DataDesensitization />
              <CallbackUrl />
              <SystemLogs />
            </Space>
          ),
        },
      ]}
      onChange={() => {
        setExpand(!expand);
      }}
      css={css`
        .ant-collapse-header {
          padding: 0 !important;
        }
      `}
    />
  );
};

export default Advanced;
