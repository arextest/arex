import { useRequest } from 'ahooks';
import { useEffect } from 'react';

import { FontSizeMap, UserInfoKey } from '../constant';
import DefaultConfig from '../defaultConfig';
import { UserService } from '../services/UserService';
import { UserInfo, useStore } from '../store';
import { themeMap } from '../style/theme';
import { clearLocalStorage, getLocalStorage, setLocalStorage } from '../utils';
import { AuthService } from '../services/AuthService';
import { useLocation, useNavigate } from 'react-router-dom';

const useInterfaceInit = () => {
  const {
    changeTheme,
    userInfo: {
      email,
      profile: { theme: themeName, fontSize },
    },
    setUserInfo,
  } = useStore();
  // checkout if the user is logged in
  const userName = getLocalStorage<UserInfo>(UserInfoKey)?.email as string;

  const nav = useNavigate();
  const { pathname } = useLocation();

  useRequest(() => UserService.userProfile(email as string), {
    ready: !!email,
    onSuccess(res: any) {
      const themeName = res.profile.theme;
      const themeLS = getLocalStorage<UserInfo>(UserInfoKey)?.profile?.theme;
      // 如果profile中的theme合法且与localStorage中的theme不一致，则更新localStorage中的theme
      if ((themeName || '') in themeMap && (themeLS || '') in themeMap) {
        if (themeName !== themeLS) {
          changeTheme(themeName);
        }
      } else {
        res.profile.theme = DefaultConfig.theme;
        // setLocalStorage<UserInfo>(UserInfoKey, (state) => {
        //   state.profile.theme = DefaultConfig.theme;
        // });
        changeTheme(DefaultConfig.theme);
      }
      setUserInfo(res);
    },
    onError() {
      //atoken过期了以后来刷新，如果还是没通过就退出
      AuthService.refreshToken({ userName }).then((res) => {
        if (res.data.body) {
          const accessToken = res.data.body.accessToken;
          const refreshToken = res.data.body.refreshToken;
          setLocalStorage('accessToken', accessToken);
          setLocalStorage('refreshToken', refreshToken);
          location.href = '/';
        } else if (pathname !== '/login') {
          clearLocalStorage();
        }
      });
    },
  });

  useEffect(() => {
    changeTheme(themeName);
    // @ts-ignore
    // document.body.style['zoom'] = FontSizeMap[fontSize]; // Non-standard: https://developer.mozilla.org/en-US/docs/Web/CSS/zoom
  }, []);
};

export default useInterfaceInit;
