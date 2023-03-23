import { LoginPage } from 'arex-common';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import logo from '../assets/img/logo.svg';
import rightBackgroundImage from '../assets/img/rightBackgroundImage.svg';
const Login = () => {
  const nav = useNavigate();
  return (
    <div>
      <LoginPage
        logo={logo}
        rightBackgroundImage={rightBackgroundImage}
        onClickContinue={() => {
          localStorage.setItem(
            'refreshToken',
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2ODE5NzgwMDQsInVzZXJuYW1lIjoidHpoYW5nbUB0cmlwLmNvbSJ9.K3PcNDDG3V8Mg4EBN113PGa6OU6_Ac5WKhfQ5EmWvE8',
          );
          localStorage.setItem(
            'accessToken',
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2Nzk5OTA4MDQsInVzZXJuYW1lIjoidHpoYW5nbUB0cmlwLmNvbSJ9.1qlDL7SF43yzwrSWVeMH23_p4qGe31ETDmrrDfg1ZgM',
          );
          nav('/');
        }}
      />
    </div>
  );
};

export default Login;
