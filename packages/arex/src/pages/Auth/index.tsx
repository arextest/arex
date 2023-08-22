import { setLocalStorage } from '@arextest/arex-core';
import { message } from 'antd';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ACCESS_TOKEN_KEY, EMAIL_KEY, REFRESH_TOKEN_KEY } from '@/constant';

import request from '../../utils/request';

function getValue(search: any, key: any) {
  //找出key第一次出现的位置
  const start = search.indexOf(key);
  if (start == -1) {
    return;
  }
  //找出key最后出现的位置
  let end = search.indexOf('&', start);
  if (end == -1) {
    end = search.length;
  }
  //取出键值对
  const str = search.substring(start, end);
  //获取getValue
  const arr = str.split('=');
  return arr;
}
const Auth = () => {
  const location = useLocation();
  const nav = useNavigate();
  useEffect(() => {
    const [_, code] = getValue(location.search || '?code=test', 'code');
    request
      .post<{ reason: string | null; userName: string; accessToken: string; refreshToken: string }>(
        '/report/login/oauthLogin',
        {
          oauthType: 'GitlabOauth',
          code: code,
        },
      )
      .then((res) => {
        if (res.body.reason) {
          message.error(res.body.reason);
        } else {
          setLocalStorage(EMAIL_KEY, res.body.userName);
          setLocalStorage(ACCESS_TOKEN_KEY, res.body.accessToken);
          setLocalStorage(REFRESH_TOKEN_KEY, res.body.refreshToken);
          nav('/');
        }
      });
  }, []);
  return <div>Auth</div>;
};

export default Auth;
