import { Typography } from 'antd';
import React, { FC } from 'react';

import { Log } from '../../services/System.type';

const LogStack: FC<{ thrown: Log['thrown'] }> = (props) => {
  return (
    <>
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
