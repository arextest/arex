import { theme, Typography } from 'antd';
import { TextProps } from 'antd/es/typography/Text';
import React, { FC } from 'react';

const DeleteIcon: FC<TextProps> = (props) => {
  const { style, ...restProps } = props;
  const { token } = theme.useToken();

  return (
    <Typography.Text type='danger' style={{ marginRight: token.marginXS, ...style }} {...restProps}>
      DELETE
    </Typography.Text>
  );
};

export default DeleteIcon;
