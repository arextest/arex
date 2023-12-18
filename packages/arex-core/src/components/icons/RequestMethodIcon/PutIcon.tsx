import { Typography } from 'antd';
import { TextProps } from 'antd/es/typography/Text';
import React, { FC } from 'react';

const PutIcon: FC<TextProps> = (props) => {
  const { style, ...restProps } = props;
  return (
    <Typography.Text type='secondary' style={{ marginRight: '8px', ...style }} {...restProps}>
      PUT
    </Typography.Text>
  );
};

export default PutIcon;
