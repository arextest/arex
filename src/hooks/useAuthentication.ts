import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { AccessTokenKey, EmailKey } from '../constant';
import { getLocalStorage } from '../helpers/utils';
import { FreePath } from '../router';

// checkout if the user is logged in
const useAuthentication = () => {
  const nav = useNavigate();
  const location = useLocation();

  const accessToken = getLocalStorage<any>(AccessTokenKey);
  const email = getLocalStorage<string>(EmailKey);

  useEffect(() => {
    // TODO 对 LocalStorage 中的数据进行校验
    if (!FreePath.includes(location.pathname) && (!accessToken || !email))
      nav('/login?redirect=' + location.pathname);
  }, [accessToken, email, nav]);
};

export default useAuthentication;
