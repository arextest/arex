import styled from '@emotion/styled';
import { Button, ButtonProps } from 'antd';
import React, { ReactNode } from 'react';

const SmallTextButton = styled((props: ButtonProps & { color?: 'primary' | 'text' | string }) => (
  <Button
    type='text'
    size='small'
    {...props}
    onClick={(e) => {
      e.stopPropagation();
      // @ts-ignore
      props.onClick?.(e);
    }}
  >
    {props.title}
  </Button>
))<{ title?: ReactNode } & ButtonProps>`
  color: ${(props) =>
    props.color === 'primary'
      ? props.theme.colorPrimary
      : props.color === 'text'
      ? props.theme.colorText
      : props.color};
`;

export default SmallTextButton;
