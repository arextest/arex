import { Badge, BadgeProps, theme } from 'antd';
import React, { FC } from 'react';

const SmallBadge: FC<BadgeProps> = (props) => {
  const { token } = theme.useToken();
  return (
    <Badge size='small' color={token.colorPrimary} offset={[6, 0]} {...props}>
      {props.children}
    </Badge>
  );
};

export default SmallBadge;
