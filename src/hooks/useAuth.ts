import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { UserInfoKey } from '../constant';
import { AuthService } from '../services/AuthService';
import { UserInfo } from '../store';
import { clearLocalStorage, getLocalStorage, setLocalStorage } from '../utils';

const useAuth = () => {
  // checkout if the user is logged in
  const userName = getLocalStorage<UserInfo>(UserInfoKey)?.email;

  const nav = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    // - 请求登录接口/verify，验证成功接口返回accessToken和refreshToken字段。验证失败accessToken和refreshToken为空
    // - 以后每次请求都要在header上增加（access-token:具体的字符串）
    // - 在接口返回responseDesc:Authentication verification failed时，表明鉴权失败
    // - 在header带上（refresh-token:具体的字符串），请求/refresh/{username}接口，该接口会验证refreshToken是否过期，
    //   没有过期返回新的accessToken和refreshToken。过期返回responseDesc:Authentication verification failed
    // - 在/refresh/{username}接口返回responseDesc:Authentication verification failed，跳转到登录页面
    userName
      ? AuthService.refreshToken({ userName }).then((res) => {
          if (res.data.body) {
            const accessToken = res.data.body.accessToken;
            const refreshToken = res.data.body.refreshToken;
            setLocalStorage('accessToken', accessToken);
            setLocalStorage('refreshToken', refreshToken);
          } else if (pathname !== '/login') {
            clearLocalStorage();
          }
        })
      : nav('/login');
  }, [userName]);
};

export default useAuth;
