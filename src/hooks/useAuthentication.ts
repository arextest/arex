import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserInfoKey } from '../constant';
import { getLocalStorage } from '../helpers/utils';
import { UserInfo } from '../store';

// checkout if the user is logged in
const useAuthentication = () => {
  const nav = useNavigate();
  const userName = getLocalStorage<UserInfo>(UserInfoKey)?.email;

  useEffect(() => {
    !userName && nav('/login');
  }, [userName]);
};

export default useAuthentication;
