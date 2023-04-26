import { LockOutlined, UserOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { App, Button, Card, Input, Space, Typography } from 'antd';
import { FlexCenterWrapper, getLocalStorage, Label, setLocalStorage } from 'arex-core';
import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ACCESS_TOKEN_KEY, EMAIL_KEY, REFRESH_TOKEN_KEY } from '../constant';
import { AuthService, UserService } from '../services';

const Logo = styled(Typography.Text)`
  height: 64px;
  display: block;
  font-size: 36px;
  font-weight: 600;
  text-align: center;
`;

let timer: NodeJS.Timer;

const Login: FC = () => {
  const nav = useNavigate();
  const { message } = App.useApp();

  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [verify, setVerify] = useState(false);
  const [emailChecked, setEmailChecked] = useState<boolean>(true);
  const [count, setCount] = useState<number>(0);

  const getEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerify(false);
    const { value } = e.target;
    if (value.match(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/)) {
      setEmailChecked(true);
    } else {
      setEmailChecked(false);
    }
    setEmail(value);
  };

  const getVerificationCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setVerificationCode(value);
  };

  const { run: sendVerifyCode } = useRequest(AuthService.sendVerifyCodeByEmail, {
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
    setVerify(true);

    if (!emailChecked || !email) {
      return message.error('email error');
    }

    timer = setInterval(() => {
      setCount((t: number) => --t);
    }, 1000);

    sendVerifyCode(email);
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

  const { run: loginVerify } = useRequest(AuthService.loginVerify, {
    manual: true,
    onSuccess(res) {
      if (res.success) {
        setLocalStorage(ACCESS_TOKEN_KEY, res.accessToken);
        setLocalStorage(REFRESH_TOKEN_KEY, res.refreshToken);
        message.success('Login succeeded');
        handleLoginSuccess(email);
      } else {
        message.error('Verification code error');
      }
    },
  });

  const handleLogin = () => {
    setVerify(true);
    if (!emailChecked) {
      return message.error('Please check your email');
    } else if (verificationCode.length !== 6) {
      return message.error('Please enter the verification code');
    }

    loginVerify({
      userName: email,
      verificationCode,
    });
  };

  useEffect(() => {
    !count && clearInterval(timer);
  }, [count]);

  return (
    <FlexCenterWrapper>
      <Card style={{ marginTop: '20vh' }}>
        <Space size={26} direction='vertical'>
          <Logo>AREX</Logo>

          {/* TODO 使用 Form 组件做数据校验以及表单提交 */}
          <div style={{ position: 'relative' }}>
            <Input
              size='large'
              placeholder='Please enter your email'
              prefix={<UserOutlined />}
              onChange={getEmail}
              status={!emailChecked && verify ? 'error' : undefined}
              allowClear
            />

            <Typography.Text
              type='danger'
              style={{ position: 'absolute', left: 0, bottom: '-24px' }}
            >
              {!emailChecked && verify && 'Please enter the correct email!'}
            </Typography.Text>
          </div>

          <Space>
            <Input
              size='large'
              placeholder='Please enter a verification code'
              prefix={<LockOutlined />}
              onChange={getVerificationCode}
            />
            <Button
              size='large'
              disabled={!!count}
              onClick={sendVerificationCode}
              style={{ width: '120px' }}
            >
              {count ? count + 's' : 'Send code'}
            </Button>
          </Space>

          <Button block size='large' type='primary' onClick={handleLogin}>
            Login
          </Button>

          <span>
            <Label>Login with</Label>
            <Button type='link' onClick={loginAsGuest} style={{ paddingLeft: 0 }}>
              Guest
            </Button>
          </span>
        </Space>
      </Card>
    </FlexCenterWrapper>
  );
};

export default Login;
