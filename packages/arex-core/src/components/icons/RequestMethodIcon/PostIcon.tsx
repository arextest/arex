import { Typography } from 'antd';
import { TextProps } from 'antd/es/typography/Text';
import React, { FC } from 'react';

const PostIcon: FC<TextProps> = (props) => {
  const { style, ...restProps } = props;
  return (
    <Typography.Text type='warning' style={{ marginRight: '8px', ...style }} {...restProps}>
      POST
    </Typography.Text>
  );
};

export default PostIcon;
