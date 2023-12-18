import { Typography } from 'antd';
import { TextProps } from 'antd/es/typography/Text';
import React, { FC } from 'react';

const GetIcon: FC<TextProps> = (props) => {
  const { style, ...restProps } = props;
  return (
    <Typography.Text type='success' style={{ marginRight: '8px', ...style }} {...restProps}>
      GET
    </Typography.Text>
  );
};

export default GetIcon;
