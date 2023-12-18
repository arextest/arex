import { Typography } from 'antd';
import { TextProps } from 'antd/es/typography/Text';
import React, { FC } from 'react';

const DeleteIcon: FC<TextProps> = (props) => {
  const { style, ...restProps } = props;
  return (
    <Typography.Text type='danger' style={{ marginRight: '8px', ...style }} {...restProps}>
      DELETE
    </Typography.Text>
  );
};

export default DeleteIcon;
