import { theme, Typography } from 'antd';
import { TextProps } from 'antd/es/typography/Text';
import React, { FC } from 'react';

const PostIcon: FC<TextProps> = (props) => {
  const { style, ...restProps } = props;
  const { token } = theme.useToken();

  return (
    <Typography.Text
      type='warning'
      style={{ marginRight: token.marginXS, ...style }}
      {...restProps}
    >
      POST
    </Typography.Text>
  );
};

export default PostIcon;
