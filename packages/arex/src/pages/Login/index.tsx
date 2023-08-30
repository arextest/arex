import Icon, { UserOutlined } from '@ant-design/icons';
import { FlexCenterWrapper, getLocalStorage, setLocalStorage, styled } from '@arextest/arex-core';
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { App, Button, Card, Divider, Form, Input, Space, Tooltip, Typography } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ACCESS_TOKEN_KEY, EMAIL_KEY, REFRESH_TOKEN_KEY } from '@/constant';
import { LoginService, UserService } from '@/services';
import { loginVerifyReq } from '@/services/LoginService';
import gitlablogo from '~icons/logos/gitlab';

import VerificationCode from './VerificationCode';

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

  const { run: sendVerifyCode } = useRequest(LoginService.sendVerifyCodeByEmail, {
    manual: true,
    onBefore() {
      setCount(60);
    },
    onSuccess(success) {
      success
        ? message.success('The verification code has been sent to the email.')
        : message.error('Authentication failed.');
    },
    onError() {
      message.error('Authentication failed.');
    },
  });

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

  const { run: loginAsGuest } = useRequest(
    () => UserService.loginAsGuest({ userName: getLocalStorage<string>(EMAIL_KEY) }),
    {
      manual: true,
      onSuccess(res) {
        setLocalStorage(EMAIL_KEY, res.userName);
        setLocalStorage(ACCESS_TOKEN_KEY, res.accessToken);
        setLocalStorage(REFRESH_TOKEN_KEY, res.refreshToken);
        handleLoginSuccess(res.userName);
      },
    },
  );

  const { run: loginVerify } = useRequest(LoginService.loginVerify, {
    manual: true,
    onSuccess(res, [{ userName }]) {
      if (res.success) {
        setLocalStorage(ACCESS_TOKEN_KEY, res.accessToken);
        setLocalStorage(REFRESH_TOKEN_KEY, res.refreshToken);
        message.success('Login succeeded');
        handleLoginSuccess(userName);
      } else {
        message.error('Verification code error');
      }
    },
  });

  useEffect(() => {
    count <= 0 && clearInterval(timer);
  }, [count]);

  const { data: oauthClientId } = useRequest(LoginService.getOauthClientId);
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
              <Space>
                Login with{' '}
                <a onClick={loginAsGuest} style={{ paddingLeft: 0 }}>
                  Guest
                </a>
                <Divider type={'vertical'} />
                <a
                  href={`${oauthClientId?.oauthUri}/oauth/authorize?response_type=code&state=STATE&scope=api&client_id=${oauthClientId?.clientId}&redirect_uri=${oauthClientId?.redirectUri}`}
                >
                  <Tooltip title={'Login with gitlab'}>
                    <Icon component={gitlablogo} />
                  </Tooltip>
                </a>
              </Space>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </FlexCenterWrapper>
  );
};

export default Login;
