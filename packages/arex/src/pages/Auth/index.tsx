import { message } from 'antd';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
  console.log(location.search, 'ocation.search');
  useEffect(() => {
    const [_, code] = getValue(location.search || '?code=test', 'code');

    console.log(code);

    request
      .post('/report/login/oauthLogin', {
        oauthType: 'GitlabOauth',
        code: code,
      })
      .then((res: any) => {
        console.log(res);
        message.success(JSON.stringify(res));
      });
  }, []);
  return <div>Auth</div>;
};

export default Auth;
