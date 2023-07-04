import { UserOutlined } from '@ant-design/icons';
import { FlexCenterWrapper, getLocalStorage, setLocalStorage } from '@arextest/arex-core';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { App, Button, Card, Form, Input, Space, Typography } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ACCESS_TOKEN_KEY, EMAIL_KEY, REFRESH_TOKEN_KEY } from '@/constant';

import VerificationCode from './VerificationCode';
export type loginVerifyReq = {
  userName: string;
  verificationCode: string;
};

const Logo = styled(Typography.Text)`
  height: 64px;
  display: block;
  font-size: 36px;
  font-weight: 600;
  text-align: center;
  margin: 16px;
`;

let timer: NodeJS.Timer;

const Login: FC = () => {
  const nav = useNavigate();
  const { message } = App.useApp();

  const [form] = Form.useForm();
  const [count, setCount] = useState<number>(0);

  const sendVerifyCode = (userName: string) => {
    console.log('sendVerifyCode', userName);
  };

  const sendVerificationCode = () => {
    form.validateFields(['userName']).then((form) => {
      timer = setInterval(() => {
        setCount((t: number) => --t);
      }, 1000);

      sendVerifyCode(form.userName);
    });
  };

  const handleLoginSuccess = (email?: string) => {
    const query = new URLSearchParams(location.search);
    const redirect = query.get('redirect');

    setLocalStorage(EMAIL_KEY, email);

    nav(redirect || '/');
  };

  const loginAsGuest = () => {
    console.log('loginAsGuest');
  };

  const loginVerify = (values: loginVerifyReq) => {
    console.log('loginVerify', values);
  };

  useEffect(() => {
    count <= 0 && clearInterval(timer);
  }, [count]);

  return (
    <FlexCenterWrapper>
      <Card style={{ marginTop: '20vh' }}>
        <Space size={26} direction='vertical'>
          <Form<loginVerifyReq> name='login' autoComplete='off' form={form} onFinish={loginVerify}>
            <Logo>AREX</Logo>

            <Form.Item
              name='userName'
              rules={[
                { required: true, message: 'Please input your email' },
                {
                  type: 'email',
                  message: 'Please input correct email',
                },
              ]}
            >
              <Input
                size='large'
                placeholder='Please enter your email'
                prefix={<UserOutlined />}
                allowClear
              />
            </Form.Item>

            <Form.Item
              name='verificationCode'
              rules={[
                { required: true, message: 'Please input your verificationCode' },
                {
                  len: 6,
                  message: 'Please input correct verification code',
                },
              ]}
            >
              <VerificationCode count={count} onSendCode={sendVerificationCode} />
            </Form.Item>

            <Form.Item>
              <Button block size='large' type='primary' htmlType='submit'>
                Login
              </Button>
            </Form.Item>

            <Form.Item>
              <span>
                Login with{' '}
                <Button type='link' onClick={loginAsGuest} style={{ paddingLeft: 0 }}>
                  Guest
                </Button>
              </span>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </FlexCenterWrapper>
  );
};

export default Login;
