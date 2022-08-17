import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthService } from '../services/AuthService';
import { useStore } from '../store';

const useAuth = () => {
  // checkout if the user is logged in
  const {
    userInfo: { email },
  } = useStore();

  const nav = useNavigate();

  useEffect(() => {
    // - 请求登录接口/verify，验证成功接口返回accessToken和refreshToken字段。验证失败accessToken和refreshToken为空
    // - 以后每次请求都要在header上增加（access-token:具体的字符串）
    // - 在接口返回responseDesc:Authentication verification failed时，表明鉴权失败
    // - 在header带上（refresh-token:具体的字符串），请求/refresh/{username}接口，该接口会验证refreshToken是否过期，
    //   没有过期返回新的accessToken和refreshToken。过期返回responseDesc:Authentication verification failed
    // - 在/refresh/{username}接口返回responseDesc:Authentication verification failed，跳转到登录页面
    email
      ? AuthService.refreshToken({ userName: email }).then((res) => {
          if (res.data.body) {
            const accessToken = res.data.body.accessToken;
            const refreshToken = res.data.body.refreshToken;
            window.localStorage.setItem('accessToken', accessToken);
            window.localStorage.setItem('refreshToken', refreshToken);
          } else if (!window.location.pathname.includes('login')) {
            window.localStorage.clear();
          }
        })
      : nav('/login');
  }, [email]);
};

export default useAuth;
