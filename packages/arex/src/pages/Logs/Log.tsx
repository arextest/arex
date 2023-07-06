import { css } from '@arextest/arex-core';
import { Collapse } from 'antd';
import React, { FC } from 'react';

import { Log as LogType } from '@/services/ReportService';

import LogHeader from './LogHeader';
import LogStack from './LogStack';

const Log: FC<{ log: LogType; color?: string }> = (props) => {
  return (
    <Collapse
      key={props.log.id}
      items={[
        {
          showArrow: false,
          key: props.log.id,
          label: <LogHeader log={props.log} />,
          children: <LogStack message={props.log.message} thrown={props.log.thrown} />,
        },
      ]}
      css={css`
        position: relative;
        .ant-collapse-header {
          .ant-collapse-header-text {
            width: 100%;
          }
          :before {
            content: '';
            height: calc(100% - 8px);
            width: 2px;
            background-color: ${props.color};
            position: absolute;
            left: 3px;
            top: 4px;
            border-radius: 1px;
          }
        }
      `}
    />
  );
};

export default Log;
