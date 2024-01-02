import { getLocalStorage, setLocalStorage } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { Divider, Space, Tooltip } from 'antd';
import React from 'react';

import { Icon } from '@/components';
import { ACCESS_TOKEN_KEY, EMAIL_KEY, REFRESH_TOKEN_KEY } from '@/constant';
import { useNavPane } from '@/hooks';
import { redirectUri } from '@/pages/Oauth';
import { LoginService, UserService } from '@/services';

const OauthLogin = () => {
  const nav = useNavPane();
  const { data: oauthClientId } = useRequest(LoginService.getOauthClientId);

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

  const handleLoginSuccess = (email?: string) => {
    const query = new URLSearchParams(location.search);
    const redirect = query.get('redirect');

    setLocalStorage(EMAIL_KEY, email);

    nav(redirect || '/');
  };

  return (
    <Space>
      Login with{' '}
      <a onClick={loginAsGuest} style={{ paddingLeft: 0 }}>
        Guest
      </a>
      {oauthClientId?.clientId && (
        <>
          <Divider type={'vertical'} />
          <a
            href={`${oauthClientId?.oauthUri}/oauth/authorize?response_type=code&state=STATE&scope=api&client_id=${oauthClientId?.clientId}&redirect_uri=${redirectUri}gitlab`}
            rel='noreferrer'
          >
            <Tooltip title={'Login with gitlab'}>
              <Icon name='Gitlab' />
            </Tooltip>
          </a>
        </>
      )}
    </Space>
  );
};

export default OauthLogin;
