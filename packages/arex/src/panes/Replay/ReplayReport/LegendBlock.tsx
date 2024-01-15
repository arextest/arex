import { Typography } from 'antd';
import React, { FC } from 'react';

interface LegendBlockProps {
  color: string;
  text: string;
}

const LegendBlock: FC<LegendBlockProps> = (props) => {
  return (
    <div>
      <div
        style={{
          width: '32px',
          height: '14px',
          display: 'inline-block',
          border: '2px solid #fff',
          marginRight: '8px',
          verticalAlign: 'text-bottom',
          backgroundColor: props.color,
        }}
      ></div>
      <Typography.Text style={{ color: props.color }}>{props.text}</Typography.Text>
    </div>
  );
};

export default LegendBlock;
