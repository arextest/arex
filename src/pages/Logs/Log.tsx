import styled from '@emotion/styled';
import { Collapse, CollapsePanelProps } from 'antd';
import React, { FC, ReactNode } from 'react';

import { Log as LogType } from '../../services/System.type';
import LogHeader from './LogHeader';
import LogStack from './LogStack';

const LogItem = styled((props: CollapsePanelProps & { color?: string; stack: ReactNode }) => (
  <Collapse.Panel {...props}>{props.stack}</Collapse.Panel>
))`
  position: relative;
  .ant-collapse-header {
    .ant-collapse-header-text {
      width: 100%;
    }
    :before {
      content: '';
      height: calc(100% - 8px);
      width: 2px;
      background-color: ${(props) => props.color};
      position: absolute;
      left: 3px;
      top: 4px;
      border-radius: 1px;
    }
  }
`;

const Log: FC<{ log: LogType; color?: string }> = (props) => {
  return (
    <Collapse key={props.log.id}>
      <LogItem
        color={props.color}
        showArrow={false}
        key={props.log.id}
        header={<LogHeader log={props.log} />}
        stack={<LogStack message={props.log.message} thrown={props.log.thrown} />}
      />
    </Collapse>
  );
};

export default Log;
