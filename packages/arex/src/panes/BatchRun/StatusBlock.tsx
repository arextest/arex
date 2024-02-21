import { Typography } from 'antd';
import React, { FC } from 'react';

const StatusBlock: FC<{
  color: string;
  text?: React.ReactNode;
  children?: React.ReactNode;
}> = (props) => {
  return (
    <span style={{ marginRight: '4px' }}>
      <div
        style={{
          display: 'inline-block',
          height: '6px',
          width: '16px',
          margin: '2px 4px',
          backgroundColor: props.color,
        }}
      >
        {props.children}
      </div>
      <Typography.Text type='secondary'>{props.text}</Typography.Text>
    </span>
  );
};

export default StatusBlock;
