import styled from '@emotion/styled';
import React, { ReactNode } from 'react';

export const BorderIcon = styled((props: { icon: ReactNode }) => (
  <span {...props}>{props.icon}</span>
))`
  margin-right: ${(props) => props.theme.marginXS}px;
  padding: 0 2px 1px;
  border: 1px solid;
  font-size: 12px;
  line-height: 12px;
  color: ${(props) => props.theme.colorTextSecondary};
`;
