import styled from '@emotion/styled';
import { Button, ButtonProps } from 'antd';
import React from 'react';

const SmallTextButton = styled((props: ButtonProps) => (
  <Button type='text' size='small' {...props}>
    {props.title}
  </Button>
))<{ title?: string } & ButtonProps>`
  color: ${(props) => props.theme.colorPrimary}!important;
`;

export default SmallTextButton;
