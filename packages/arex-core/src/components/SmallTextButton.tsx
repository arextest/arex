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
  const { title, ...restProps } = props;
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
      {title && (
        <Typography.Text
          color={props.color}
          type={props.color === 'secondary' ? 'secondary' : undefined}
        >
          {title}
        </Typography.Text>
      )}
    </Button>
  );
});

export default SmallTextButton;
