import { css } from '@emotion/react';
import { Button } from 'antd';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
interface WelcomeProps {
  rightBackgroundImage: any;
  logo: any;
  onClickContinue: () => void;
}
const Welcome: FC<WelcomeProps> = ({ rightBackgroundImage, logo, onClickContinue }) => {
  const { t } = useTranslation();
  return (
    <div
      css={css`
        .welcome {
          min-width: 1000px;
          height: 100vh;
          display: flex;
          .left-box {
            padding: 100px;
            flex-basis: 580px;
            border-right: 1px solid #eee;
            .logo {
              font-size: 30px;
              font-weight: bolder;
              margin-bottom: 60px;
              display: flex;
              align-items: center;
              img {
                width: 52.5px;
                margin-right: 14px;
              }
            }
            h1 {
              font-weight: 600;
              font-size: 32px;
              line-height: 44px;
              color: #22222a;
            }
            .desc {
              font-size: 16px;
              line-height: 24px;
              display: block;
              color: #9293ab;
              margin-bottom: 30px;
            }
          }
          .right-box {
            flex-grow: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            .img-wrap {
              background-color: #0a3364;
              height: 100%;
              width: 100%;
              background-size: 100%;
              background-repeat: no-repeat;
              background-position: center;
            }
          }
        }
      `}
    >
      <div className={'welcome'}>
        <div className={'left-box'}>
          <div className='login-form'>
            <div className='logo'>
              <img src={logo} alt='' />
              <span>AREX</span>
            </div>
            <h1 className={'title'}>
              {t('auth.login')}，
              <br />
              Welcome to Arex。
            </h1>
            <p className={'desc'}>
              You will be redirected to your source control management system to authenticate.
            </p>
            <Button
              type={'primary'}
              style={{ width: '100%' }}
              size={'large'}
              onClick={() => {
                onClickContinue();
              }}
            >
              Continue
            </Button>
          </div>
        </div>
        <div className={'right-box'}>
          <div
            className={'img-wrap'}
            style={{ backgroundImage: `url(${rightBackgroundImage})` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
