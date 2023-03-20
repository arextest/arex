import { useRequest } from 'ahooks';
import axios from 'axios';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { PagesType } from '../components/panes';
import { AccessTokenKey, EmailKey, RefreshTokenKey } from '../constant';
import { genPaneIdByUrl, getMenuTypeByPageType } from '../helpers/functional/url';
import { clearLocalStorage, getLocalStorage, setLocalStorage } from '../helpers/utils';
import { useCustomNavigate } from '../router/useCustomNavigate';
import { useCustomSearchParams } from '../router/useCustomSearchParams';
import { AuthService } from '../services/Auth.service';
import { UserService } from '../services/User.service';
import { useStore } from '../store';
import useUserProfile from '../store/useUserProfile';

// init theme, fontSize, etc.
// 由于使用了 useParams hook, 该 hook 只在 RouterComponent 中生效
// (例如在 App.tsx 中无效
const useInit = () => {
  // checkout if the user is logged in
  const email = getLocalStorage<string>(EmailKey);
  const customNavigate = useCustomNavigate();
  const customSearchParams = useCustomSearchParams();
  const params = useParams();
  const { pathname } = useLocation();
  const { setUserProfile } = useUserProfile();
  const { setActiveMenu, setActiveWorkspaceId } = useStore();

  const { run: refreshToken } = useRequest(AuthService.refreshToken, {
    manual: true,
    onSuccess(res) {
      if (res.data.body) {
        const accessToken = res.data.body.accessToken;
        const refreshToken = res.data.body.refreshToken;
        setLocalStorage(AccessTokenKey, accessToken);
        setLocalStorage(RefreshTokenKey, refreshToken);
        window.location.reload();
      } else if (pathname !== '/login') {
        clearLocalStorage();
        window.location.reload();
      }
    },
    onError() {
      clearLocalStorage();
      window.location.reload();
    },
  });

  useRequest(() => UserService.getUserProfile(email as string), {
    ready: !!email,
    onSuccess(res) {
      res && setUserProfile(res);
    },
    onError() {
      // token过期了以后来刷新，如果还是没通过就退出
      email && refreshToken({ userName: email });
    },
  });
  // 检测arex desktop agent
  useRequest(() => axios.get('http://localhost:16888/vi/health'), {
    onSuccess() {
      window.__AREX_DESKTOP_AGENT__ = true;
    },
  });

  // TODO 实现通用的所用页面初始化方法
  // 根据 url 初始化页面, 同时初始化 workspaceId
  useEffect(() => {
    if (params.workspaceId) {
      setActiveWorkspaceId(params.workspaceId);
    }
    if (params.pagesType) {
      setActiveMenu(
        getMenuTypeByPageType(params.pagesType),
        genPaneIdByUrl(`/${params.workspaceId}/${params.pagesType}/${params.rawId}`),
      );
      //   以下几种page的复原单独实现
      if (params.pagesType === PagesType.ReplayAnalysis) {
        customNavigate({
          path: customSearchParams.pathname,
          query: {
            data: customSearchParams.query.data,
          },
        });
      } else if (params.pagesType === PagesType.ReplayCase) {
        customNavigate({
          path: customSearchParams.pathname,
          query: {
            data: customSearchParams.query.data,
          },
        });
      } else if (params.pagesType === PagesType.BatchCompare) {
        customNavigate({
          path: customSearchParams.pathname,
          query: {
            planId: customSearchParams.query.planId,
          },
        });
      } else if (params.pagesType === PagesType.Run) {
        customNavigate({
          path: customSearchParams.pathname,
          query: customSearchParams.query,
        });
      }
    }
  }, []);
};

export default useInit;
