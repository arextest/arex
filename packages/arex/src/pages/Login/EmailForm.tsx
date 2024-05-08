import { setLocalStorage } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Button, Form, Input } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Icon } from '@/components';
import { ACCESS_TOKEN_KEY, EMAIL_KEY, isClient, REFRESH_TOKEN_KEY } from '@/constant';
import OauthLogin from '@/pages/Login/OauthLogin';
import VerificationCode from '@/pages/Login/VerificationCode';
import { LoginService } from '@/services';
import { loginVerifyReq } from '@/services/LoginService';
import { useClientStore } from '@/store';

let timer: NodeJS.Timeout;

const EmailForm: FC = () => {
  const nav = useNavigate();
  const { message } = App.useApp();

  const [form] = Form.useForm();

  const { organization } = useClientStore();
  useEffect(() => {
    form.setFieldValue('organization', organization);
  }, [organization]);

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

  return (
    <div key='login-form'>
      <Form<loginVerifyReq> name='login' autoComplete='off' form={form} onFinish={loginVerify}>
        {isClient && (
          <Form.Item name='organization'>
            <Input disabled prefix={<Icon name='Building2' />} />
          </Form.Item>
        )}

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
            prefix={<Icon name='Mail' />}
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
      </Form>

      <OauthLogin />
    </div>
  );
};

export default EmailForm;
