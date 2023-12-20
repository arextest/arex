import { theme, Typography } from 'antd';
import { TextProps } from 'antd/es/typography/Text';
import React, { FC } from 'react';

const PutIcon: FC<TextProps> = (props) => {
  const { style, ...restProps } = props;
  const { token } = theme.useToken();

  return (
    <Typography.Text
      type='secondary'
      style={{ marginRight: token.marginXS, ...style }}
      {...restProps}
    >
      PUT
    </Typography.Text>
  );
};

export default PutIcon;
