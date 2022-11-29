import { LockOutlined, UserOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { Button, Input, message, theme } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Label } from '../../components/styledComponents';
import { AccessTokenKey, EmailKey, RefreshTokenKey } from '../../constant';
import { setLocalStorage } from '../../helpers/utils';
import { AuthService } from '../../services/Auth.service';
import { UserService } from '../../services/User.service';
import WorkspaceService from '../../services/Workspace.service';

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  height: 100%;
  .login {
    width: 400px;
    margin: 10% auto;
    .login-title {
      height: 56px;
      font-size: 36px;
      font-weight: 700;
      text-align: center;
      margin-bottom: 24px;
    }
    .login-email-tip {
      height: 30px;
      color: red;
    }
    .login-verificationCode {
      display: flex;
      margin-bottom: 30px;
    }
  }
`;

let timer: NodeJS.Timer;

const Login: FC = () => {
  const nav = useNavigate();
  const { token } = theme.useToken();

  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [emailChecked, setEmailChecked] = useState<boolean>(true);
  const [loadings, setLoadings] = useState<boolean>(false);
  const [count, setCount] = useState<number>(60);

  const getEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    onSuccess(res) {
      res.data.body.success
        ? message.success('The verification code has been sent to the email.')
        : message.error('Authentication failed.');
    },
    onError() {
      message.error('Authentication failed.');
    },
  });

  const sendVerificationCode = () => {
    if (!emailChecked || !email) {
      return message.error('email error');
    }

    setLoadings(true);
    timer = setInterval(() => {
      setCount((t: number) => --t);
    }, 1000);

    sendVerifyCode(email);
  };

  // 用户进入前初始化
  const { run: listWorkspace } = useRequest(WorkspaceService.listWorkspace, {
    manual: true,
    onBefore(params) {
      setLocalStorage(EmailKey, params[0].userName);
    },
    onSuccess(res, [{ userName }]) {
      res.length
        ? nav('/')
        : createWorkspace({
            userName,
            workspaceName: 'Default',
          });
    },
  });

  const { run: createWorkspace } = useRequest(WorkspaceService.createWorkspace, {
    manual: true,
    onFinally() {
      nav('/');
    },
  });

  const { run: loginAsGuest } = useRequest(UserService.loginAsGuest, {
    manual: true,
    onSuccess(res) {
      setLocalStorage(EmailKey, res.userName);
      setLocalStorage(AccessTokenKey, res.accessToken);
      setLocalStorage(RefreshTokenKey, res.refreshToken);
      listWorkspace({ userName: res.userName });
    },
  });

  const { run: loginVerify } = useRequest(AuthService.loginVerify, {
    manual: true,
    onSuccess(res) {
      if (res.data.body.success) {
        setLocalStorage(AccessTokenKey, res.data.body.accessToken);
        setLocalStorage(RefreshTokenKey, res.data.body.refreshToken);
        message.success('Login succeeded');
        listWorkspace({ userName: email });
      } else {
        message.error('Verification code error');
      }
    },
  });

  const handleLogin = () => {
    if (!emailChecked || email == '') {
      message.error('Please check your email');
      return;
    } else if (verificationCode == '') {
      message.error('Please fill in the verification code');
      return;
    }

    loginVerify({
      userName: email,
      verificationCode,
    });
  };

  useEffect(() => {
    if (!count) {
      clearInterval(timer);
      setCount(60);
      setLoadings(false);
    }
  }, [count]);

  return (
    <LoginWrapper>
      <div className={'login'}>
        <div className={'login-title'}>AREX</div>
        {/* TODO 使用 Form 组件做数据校验以及表单提交 */}
        <Input
          size='large'
          placeholder='Please enter your email！'
          prefix={<UserOutlined />}
          onChange={getEmail}
          status={emailChecked ? '' : 'error'}
          allowClear
        />

        <div className={'login-email-tip'}>
          {!emailChecked && 'Please enter the correct email!'}
        </div>
        <div className={'login-verificationCode'}>
          <Input
            size='large'
            placeholder='Please enter a verification code！'
            prefix={<LockOutlined />}
            onChange={getVerificationCode}
          />
          <Button
            size='large'
            disabled={loadings}
            onClick={sendVerificationCode}
            style={{ marginLeft: '8px' }}
          >
            {loadings ? count + 's' : 'Send code'}
          </Button>
        </div>

        <Button
          block
          type='primary'
          size='large'
          onClick={handleLogin}
          style={{ marginBottom: '10px' }}
        >
          Login
        </Button>

        <div>
          <Label>Login with</Label>
          <Button
            type='link'
            onClick={loginAsGuest}
            style={{ color: token.colorPrimaryText, paddingLeft: 0 }}
          >
            Guest
          </Button>
        </div>
      </div>
    </LoginWrapper>
  );
};

export default Login;
