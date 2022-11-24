import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { AccessTokenKey, EmailKey } from '../constant';
import { getLocalStorage } from '../helpers/utils';
import { authPath } from '../router';
import { UserInfo } from '../store';

// checkout if the user is logged in
const useAuthentication = () => {
  const nav = useNavigate();
  const location = useLocation();

  const accessToken = getLocalStorage<UserInfo>(AccessTokenKey);
  const email = getLocalStorage<string>(EmailKey);

  useEffect(() => {
    if (authPath.includes(location.pathname) && (!accessToken || !email)) nav('/login');
  }, [accessToken, email, nav]);
};

export default useAuthentication;
