import { CoffeeOutlined } from '@ant-design/icons';
import { FlexCenterWrapper, setLocalStorage, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { Card, message, Typography } from 'antd';
import React from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { ACCESS_TOKEN_KEY, EMAIL_KEY, isClient, REFRESH_TOKEN_KEY } from '@/constant';
import request from '@/utils/request';

export const redirectUri = isClient
  ? `http://localhost:${__AUTH_PORT__}/oauth/`
  : window.location.origin + '/oauth/';

const Auth = () => {
  const nav = useNavigate();
  const { t } = useTranslation('page');
  const [searchParams] = useSearchParams();
  const { provider } = useParams();

  useRequest(
    () => {
      return request.post<{
        reason: string | null;
        userName: string;
        accessToken: string;
        refreshToken: string;
      }>(
        '/report/login/oauthLogin',
        {
          oauthType: 'GitlabOauth',
          code: searchParams.get('code'),
          redirectUri: redirectUri + provider,
        },
        {
          headers: {
            'access-token': 'no',
          },
        },
      );
    },
    {
      ready: !!searchParams.get('code'),
      onSuccess(res) {
        if (res.body.reason) {
          message.error(res.body.reason);
        } else {
          setLocalStorage(EMAIL_KEY, res.body.userName);
          setLocalStorage(ACCESS_TOKEN_KEY, res.body.accessToken);
          setLocalStorage(REFRESH_TOKEN_KEY, res.body.refreshToken);
          nav('/');
        }
      },
    },
  );

  return (
    <FlexCenterWrapper style={{ height: '200px' }}>
      <Card style={{ height: '100px', width: '400px' }}>
        <Typography.Title level={5}>
          <CoffeeOutlined /> {t('oauth.authenticating')}
        </Typography.Title>
        <Typography.Text>{t('oauth.redirectedTip')}</Typography.Text>
      </Card>
    </FlexCenterWrapper>
  );
};

export default Auth;
