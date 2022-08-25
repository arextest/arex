import { useRequest } from 'ahooks';
import { useEffect } from 'react';

import { FontSizeMap, UserInfoKey } from '../constant';
import DefaultConfig from '../defaultConfig';
import { UserService } from '../services/UserService';
import { UserInfo, useStore } from '../store';
import { themeMap } from '../style/theme';
import { getLocalStorage } from '../utils';

const useInterfaceInit = () => {
  const {
    changeTheme,
    userInfo: {
      email,
      profile: { theme: themeName, fontSize },
    },
    setUserInfo,
  } = useStore();

  useRequest(() => UserService.userProfile(email as string), {
    ready: !!email,
    onSuccess(res) {
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
  });

  useEffect(() => {
    changeTheme(themeName);
    // @ts-ignore
    document.body.style['zoom'] = FontSizeMap[fontSize]; // Non-standard: https://developer.mozilla.org/en-US/docs/Web/CSS/zoom
  }, []);
};

export default useInterfaceInit;
