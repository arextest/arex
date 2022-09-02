import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { UserInfoKey } from '../constant';
import { AuthService } from '../services/AuthService';
import { UserInfo } from '../store';
import { clearLocalStorage, getLocalStorage, setLocalStorage } from '../utils';

const useAuth = () => {
  // checkout if the user is logged in
  const userName = getLocalStorage<UserInfo>(UserInfoKey)?.email;

  const nav = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    userName ? null : nav('/login');
  }, [userName]);
};

export default useAuth;
