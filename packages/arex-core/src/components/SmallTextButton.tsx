import styled from '@emotion/styled';
import { Button, ButtonProps } from 'antd';
import React, { ReactNode } from 'react';

const SmallTextButton = styled(
  React.forwardRef<HTMLElement, ButtonProps & { color?: 'primary' | 'text' | string }>(
    (props, ref) => (
      <Button
        type='text'
        size='small'
        {...props}
        onClick={(e) => {
          e.stopPropagation();
          // @ts-ignore
          props.onClick?.(e);
        }}
        ref={ref}
      >
        {props.title}
      </Button>
    ),
  ),
)<{ title?: ReactNode } & ButtonProps>`
  color: ${(props) =>
    props.color === 'primary'
      ? props.theme.colorPrimary
      : props.color === 'text'
      ? props.theme.colorText
      : props.color};
`;

export default SmallTextButton;
