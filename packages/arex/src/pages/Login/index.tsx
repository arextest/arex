import { UserOutlined } from '@ant-design/icons';
import { FlexCenterWrapper, getLocalStorage, setLocalStorage, styled } from '@arextest/arex-core';
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { App, Button, Card, Divider, Form, Input, Space, Typography } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ACCESS_TOKEN_KEY, EMAIL_KEY, REFRESH_TOKEN_KEY } from '@/constant';
import { LoginService, UserService } from '@/services';
import { loginVerifyReq } from '@/services/LoginService';

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

  const baseInfo = {
    thAppClientId: 'thAppClientId',
    thAppRedirectUri: 'http://10.5.153.1:8088/auth',
  };

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
            {/*https://github.com/login/oauth/authorize*/}
            <Space>
              <span
                css={css`
                  margin-right: 10px;
                `}
              >
                其他登录方式 :{' '}
              </span>
              <a
                href={`https://github.com/login/oauth/authorize?response_type=code&state=STATE&scope=api&client_id=${baseInfo.thAppClientId}&redirect_uri=${baseInfo.thAppRedirectUri}`}
              >
                github
              </a>
              <Divider type={'vertical'} />
              <a href='http://github.com/'>gitlab</a>
            </Space>
          </Form>
        </Space>
      </Card>
    </FlexCenterWrapper>
  );
};

export default Login;
