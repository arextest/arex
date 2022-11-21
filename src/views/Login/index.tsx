import './index.less';

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useMount } from 'ahooks';
import { Button, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AccessTokenKey, RefreshTokenKey } from '../../constant';
import { getLocalStorage, setLocalStorage } from '../../helpers/utils';
import { AuthService } from '../../services/AuthService';
import { UserService } from '../../services/UserService';
import WorkspaceService from '../../services/Workspace.service';
import { useStore } from '../../store';
const OtherLoginMethods = styled.div`
  a {
    margin-left: 4px;
  }
`;
let timeChange: any;
const Login = () => {
  const nav = useNavigate();
  const { setUserInfo } = useStore();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [emailchecked, setEmailchecked] = useState<boolean>(true);
  const [loadings, setLoadings] = useState<boolean>(false);
  const [count, setCount] = useState<number>(60);
  const getEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value.match(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/)) {
      setEmailchecked(true);
    } else {
      setEmailchecked(false);
    }
    setEmail(value);
  };

  const getVerificationCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setVerificationCode(value);
  };

  const sendVerificationCode = () => {
    if (!emailchecked || email == '') {
      message.error('email error');
      return;
    }
    setLoadings(true);
    timeChange = setInterval(() => {
      setCount((t: number) => --t);
    }, 1000);
    AuthService.sendVerifyCodeByEmail(email).then((res) => {
      if (res.data.body.success == true) {
        message.success('The verification code has been sent to the email.');
      } else {
        message.error('Authentication failed.');
      }
    });
  };
  // 用户进入前初始化
  const initBeforeUserEntry = (userName: string) => {
    WorkspaceService.listWorkspace({
      userName: userName,
    }).then((workspaces) => {
      if (workspaces.length === 0) {
        const params = {
          userName: userName,
          workspaceName: 'Default',
        };
        WorkspaceService.createWorkspace(params).then((res) => {
          setUserInfo(userName);
          nav('/');
        });
      } else {
        setUserInfo(userName);
        nav('/');
      }
    });
  };

  const guestLogin = () => {
    UserService.loginAsGuest({ userName: getLocalStorage('guestUserName') }).then((res) => {
      if (res.body.success) {
        setLocalStorage('guestUserName', res.body.userName);
        setLocalStorage(AccessTokenKey, res.body.accessToken);
        setLocalStorage(RefreshTokenKey, res.body.refreshToken);
        initBeforeUserEntry(res.body.userName);
      }
    });
  };

  const login = () => {
    if (!emailchecked || email == '') {
      message.error('Please check your email');
      return;
    } else if (verificationCode == '') {
      message.error('Please fill in the verification code');
      return;
    }

    AuthService.loginVerify({
      userName: email,
      verificationCode,
    }).then((res) => {
      if (res.data.body.success) {
        setLocalStorage(AccessTokenKey, res.data.body.accessToken);
        setLocalStorage(RefreshTokenKey, res.data.body.refreshToken);
        message.success('Login succeeded');
        initBeforeUserEntry(email);
      } else {
        message.error('Verification code error');
      }
    });
  };
  useEffect(() => {
    if (!count) {
      clearInterval(timeChange);
      setCount(60);
      setLoadings(false);
    }
  }, [count]);

  return (
    <div className={'login-layout'}>
      <div className={'login'}>
        <div className={'login-title'}>AREX</div>
        {/* TODO 使用 Form 组件做数据校验以及表单提交 */}
        <Input
          size='large'
          placeholder='Please enter your email！'
          prefix={<UserOutlined />}
          onChange={getEmail}
          status={emailchecked ? '' : 'error'}
          allowClear
        />
        {emailchecked ? (
          <div className={'login-email-tip'}></div>
        ) : (
          <div className={'login-email-tip'}>Please enter the correct email!</div>
        )}
        <div className={'login-verificationCode'}>
          <Input
            size='large'
            placeholder='Please enter a verification code！'
            prefix={<LockOutlined />}
            onChange={getVerificationCode}
          />
          <Button
            style={{ marginLeft: '8px' }}
            size='large'
            onClick={sendVerificationCode}
            disabled={loadings}
          >
            {loadings ? count + 's' : 'Verification code'}
          </Button>
        </div>
        <Button type='primary' block size='large' onClick={login} style={{ marginBottom: '10px' }}>
          Login
        </Button>
        <OtherLoginMethods>
          Login with :{' '}
          <a
            onClick={() => {
              guestLogin();
            }}
          >
            Guest
          </a>
        </OtherLoginMethods>
      </div>
    </div>
  );
};

export default Login;
