import styled from '@emotion/styled';
import { Button, ButtonProps } from 'antd';
import React from 'react';

const SmallTextButton = styled((props: ButtonProps & { color?: 'primary' | 'text' | string }) => (
  <Button type='text' size='small' {...props}>
    {props.title}
  </Button>
))<{ title?: string } & ButtonProps>`
  color: ${(props) =>
    props.color === 'primary'
      ? props.theme.colorPrimary
      : props.color === 'text'
      ? props.theme.colorText
      : props.color}!important;
`;

export default SmallTextButton;
