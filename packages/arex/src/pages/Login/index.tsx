import { FlexCenterWrapper, styled } from '@arextest/arex-core';
import { Card, Typography } from 'antd';
import React, { FC } from 'react';

import { MacDraggableArea } from '@/components';
import EmailForm from '@/pages/Login/EmailForm';

const Logo = styled(Typography.Text)`
  height: 64px;
  display: block;
  font-size: 36px;
  font-weight: 600;
  text-align: center;
  margin: 16px;
`;

const Login: FC = () => {
  return (
    <FlexCenterWrapper>
      <MacDraggableArea />

      <Card style={{ marginTop: '20vh' }}>
        <Logo>AREX</Logo>
        <EmailForm />
      </Card>
    </FlexCenterWrapper>
  );
};

export default Login;
