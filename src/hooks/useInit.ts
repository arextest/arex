import { useRequest } from 'ahooks';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { EmailKey, FontSizeMap, UserInfoKey } from '../constant';
import DefaultConfig from '../defaultConfig';
import { clearLocalStorage, getLocalStorage, setLocalStorage } from '../helpers/utils';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';
import { UserInfo, useStore } from '../store';
import { themeMap } from '../style/theme';

// init theme, fontSize, etc.
const useInit = () => {
  const {
    changeTheme,
    userInfo: {
      profile: { theme: themeName, fontSize },
    },
    setUserInfo,
  } = useStore();
  // checkout if the user is logged in
  const email = getLocalStorage<string>(EmailKey);

  const nav = useNavigate();
  const { pathname } = useLocation();

  const { run: refreshToken } = useRequest(AuthService.refreshToken, {
    manual: true,
    onSuccess(res) {
      if (res.data.body) {
        const accessToken = res.data.body.accessToken;
        const refreshToken = res.data.body.refreshToken;
        setLocalStorage('accessToken', accessToken);
        setLocalStorage('refreshToken', refreshToken);
        nav('/');
      } else if (pathname !== '/login') {
        clearLocalStorage();
      }
    },
    onError() {
      clearLocalStorage();
    },
  });

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
      // token过期了以后来刷新，如果还是没通过就退出
      refreshToken({ userName: email });
    },
  });

  useEffect(() => {
    changeTheme(themeName);
    // @ts-ignore
    // document.body.style['zoom'] = FontSizeMap[fontSize]; // Non-standard: https://developer.mozilla.org/en-US/docs/Web/CSS/zoom
  }, []);
};

export default useInit;
