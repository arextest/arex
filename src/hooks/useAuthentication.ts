import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { AccessTokenKey, EmailKey } from '../constant';
import { getLocalStorage } from '../helpers/utils';
import { authPath } from '../router';

// checkout if the user is logged in
const useAuthentication = () => {
  const nav = useNavigate();
  const location = useLocation();

  const accessToken = getLocalStorage<any>(AccessTokenKey);
  const email = getLocalStorage<string>(EmailKey);

  useEffect(() => {
    if (authPath.includes(location.pathname) && (!accessToken || !email)) nav('/login');
  }, [accessToken, email, nav]);
};

export default useAuthentication;
