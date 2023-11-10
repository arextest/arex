import { getLocalStorage } from '@arextest/arex-core';
import { match } from 'path-to-regexp';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ACCESS_TOKEN_KEY, EMAIL_KEY } from '@/constant';
import { FreePath } from '@/router';

// checkout if the user is logged in
const useAuthentication = () => {
  const nav = useNavigate();
  const location = useLocation();

  const accessToken = getLocalStorage<string>(ACCESS_TOKEN_KEY);
  const email = getLocalStorage<string>(EMAIL_KEY);

  useEffect(() => {
    // TODO verify LocalStorage data
    const isFreePathname = FreePath.some((path) => {
      const fn = match(path, { decode: decodeURIComponent });
      return fn(location.pathname);
    });
    const hasLoginInfo = accessToken && email;
    if (!isFreePathname && !hasLoginInfo) nav('/login?redirect=' + location.pathname);
  }, [accessToken, email, location.pathname, nav]);
};

export default useAuthentication;
