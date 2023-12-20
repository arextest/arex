import { theme, Typography } from 'antd';
import { TextProps } from 'antd/es/typography/Text';
import React, { FC } from 'react';

const PatchIcon: FC<TextProps> = (props) => {
  const { style, ...restProps } = props;
  const { token } = theme.useToken();

  return (
    <Typography.Text
      type='secondary'
      style={{ marginRight: token.marginXS, ...style }}
      {...restProps}
    >
      PATCH
    </Typography.Text>
  );
};

export default PatchIcon;
