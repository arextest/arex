import { getLocalStorage } from 'arex-core';
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
    // TODO 对 LocalStorage 中的数据进行校验
    if (!FreePath.includes(location.pathname) && (!accessToken || !email))
      nav('/login?redirect=' + location.pathname);
  }, [accessToken, email, location.pathname, nav]);
};

export default useAuthentication;
