import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { UserInfoKey } from '../constant';
import {
  clearLocalStorage,
  getChromeVersion,
  getLocalStorage,
  setLocalStorage,
} from '../helpers/utils';
import { AuthService } from '../services/AuthService';
import { UserInfo } from '../store';

const useAuthAndCheckChromeVersion = () => {
  // checkout if the user is logged in
  const userName = getLocalStorage<UserInfo>(UserInfoKey)?.email;

  const nav = useNavigate();

  useEffect(() => {
    if (getChromeVersion() < 0) {
      localStorage.clear();
      nav('/upgradebrowser');
    } else {
      userName ? null : nav('/login');
    }
  }, [userName]);
};

export default useAuthAndCheckChromeVersion;
