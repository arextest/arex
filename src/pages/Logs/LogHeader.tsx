import styled from '@emotion/styled';
import { Tag, Typography } from 'antd';
import React, { FC } from 'react';

import { Log } from '../../services/System.type';

const LogHeaderWrapper = styled.div`
  .no-shrink {
    flex-shrink: 0;
  }
  .space {
    display: flex;
    max-width: 100%;
    & > *:not(:last-of-type) {
      margin-right: 8px;
    }
  }
`;

const LogHeader: FC<{ log: Log }> = (props) => {
  return (
    <LogHeaderWrapper>
      <div className='space'>
        <Typography.Text className='no-shrink'>
          {new Date(props.log.millis).toLocaleString()}
        </Typography.Text>

        <Typography.Text strong ellipsis>
          {props.log.message}
        </Typography.Text>

        <Typography.Text className='no-shrink' type='secondary'>
          {props.log.loggerName}
        </Typography.Text>
      </div>

      <div className='space'>
        <Typography.Text strong ellipsis>
          {`${props.log.source.className} - ${props.log.source.fileName} : ${props.log.source.lineNumber}`}
        </Typography.Text>

        {Object.values(props.log.contextMap).map((context, index) => (
          <Tag key={index}>{context}</Tag>
        ))}
      </div>
    </LogHeaderWrapper>
  );
};

export default LogHeader;
