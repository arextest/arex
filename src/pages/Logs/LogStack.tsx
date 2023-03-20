import { Typography } from 'antd';
import React, { FC } from 'react';

import { Log } from '../../services/System.type';

const LogStack: FC<{ message: string; thrown: Log['thrown'] }> = (props) => {
  return (
    <>
      <Typography.Title level={5} style={{ whiteSpace: 'pre-line' }}>
        {props.message}
      </Typography.Title>
      <Typography.Text strong>{props.thrown?.type}</Typography.Text>

      {props.thrown?.stackTrace.map((track, index) => (
        <Typography.Text
          type='secondary'
          key={index}
          style={{ display: 'block' }}
        >{`at ${track.className} (${track.fileName}:${track.lineNumber})`}</Typography.Text>
      ))}

      {!props.thrown?.stackTrace && (
        <Typography.Text type='secondary'>No Stack Trace</Typography.Text>
      )}
    </>
  );
};

export default LogStack;
