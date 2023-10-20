import { Button, ButtonProps, Typography } from 'antd';
import { TextProps } from 'antd/es/typography/Text';
import React, { ReactNode } from 'react';

const SmallTextButton = React.forwardRef<
  HTMLElement,
  Omit<ButtonProps, 'title'> & {
    color?: TextProps['color'];
    title?: ReactNode;
  }
>((props, ref) => {
  const { title, icon, ...restProps } = props;
  return (
    <Button
      ref={ref}
      type={'text'}
      size='small'
      {...restProps}
      onClick={(e) => {
        e.stopPropagation();
        props.onClick?.(e);
      }}
    >
      <Typography.Text
        color={props.color}
        type={props.color === 'secondary' ? 'secondary' : undefined}
      >
        <span style={{ marginRight: '6px' }}>{icon}</span>
        {title}
      </Typography.Text>
    </Button>
  );
});

export default SmallTextButton;
