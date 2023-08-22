import { message } from 'antd';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import request from '../../utils/request';

// 写一个斐波那契额数列js
// function fib(n) {  // 递归
//   if (n == 1 || n == 2) {
//     return 1;
//   }
//   return fib(n - 1) + fib(n - 2);
// }
// console.log(fib(10));

// 写一个拉格朗日中值定理js // 拉格朗日中值定理
// // function lagrange(n) {
// //   if (n == 1 || n == 2) {
// //     return 1;
// //   }
// //   return lagrange(n - 1) + lagrange(n - 2);
// // }




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
