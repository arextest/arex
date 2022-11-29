import { useRequest } from "ahooks";
import { useLocation, useNavigate } from "react-router-dom";

import { AccessTokenKey, EmailKey, RefreshTokenKey } from "../constant";
import {
  clearLocalStorage,
  getLocalStorage,
  setLocalStorage,
} from "../helpers/utils";
import { AuthService } from "../services/AuthService";
import useUserProfile from "../store/useUserProfile";
import { UserService } from "../services/User.service";

// init theme, fontSize, etc.
const useInit = () => {
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
        setLocalStorage(AccessTokenKey, accessToken);
        setLocalStorage(RefreshTokenKey, refreshToken);
        nav("/");
      } else if (pathname !== "/login") {
        clearLocalStorage();
      }
    },
    onError() {
      clearLocalStorage();
    },
  });

  useRequest(() => UserService.getUserProfile(email as string), {
    ready: !!email,
    onSuccess(res: any) {
      useUserProfile.setState(res);
    },
    onError() {
      // token过期了以后来刷新，如果还是没通过就退出
      email && refreshToken({ userName: email });
    },
  });
};

export default useInit;
