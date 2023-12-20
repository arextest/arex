import { theme, Typography } from 'antd';
import { TextProps } from 'antd/es/typography/Text';
import React, { FC } from 'react';

const GetIcon: FC<TextProps> = (props) => {
  const { style, ...restProps } = props;
  const { token } = theme.useToken();

  return (
    <Typography.Text
      type='success'
      style={{ marginRight: token.marginXS, ...style }}
      {...restProps}
    >
      GET
    </Typography.Text>
  );
};

export default GetIcon;
