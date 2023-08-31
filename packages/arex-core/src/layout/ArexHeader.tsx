/// <reference types="vite-plugin-svgr/client" />
import styled from '@emotion/styled';
import { Typography } from 'antd';
import React, { FC } from 'react';

import { ReactComponent as LogoIconDark } from '../../assets/svg/logo_dark.svg';
import { ReactComponent as LogoIconLight } from '../../assets/svg/logo_light.svg';
import { GithubStarButton } from '../components';
import { useArexCoreConfig } from '../hooks';

export interface AppHeaderProps {
  githubStar?: boolean;
  menu?: React.ReactNode;
  extra?: React.ReactNode;
  onLogoClick?: React.MouseEventHandler<HTMLElement>;
}

const HeaderWrapper = styled.div`
  height: 46px;
  padding: 7px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${(props) => props.theme.colorBorder}};

    .left,
    .right {
      display: flex;
      align-items: center;
    }
    .logo {
      width: 100px;
      text-align: center;
      font-weight: 600;
      display: inline-block;
      border-radius: 0.25rem;
      font-size: 14px;
      color: ${(props) => props.theme.colorText};
    }
    .logo:hover {
      color: ${(props) => props.theme.colorTextSecondary};
    }
  `;

const ArexHeader: FC<AppHeaderProps> = (props) => {
  const { theme } = useArexCoreConfig();

  return (
    <HeaderWrapper>
      <div className={'left'}>
        <a
          className={'logo'}
          target='_blank'
          href={'http://arextest.com'}
          rel='noreferrer'
          style={{ display: 'flex' }}
        >
          {React.createElement(theme === 'dark' ? LogoIconDark : LogoIconLight, {
            style: { height: '20px' },
          })}
          <Typography.Text style={{ lineHeight: '24px', fontSize: '12px' }}>AREX</Typography.Text>
        </a>
        {props.githubStar && <GithubStarButton theme={theme} />}
        {props.menu}
      </div>

      <div className={'right'}>{props.extra}</div>
    </HeaderWrapper>
  );
};

export default ArexHeader;
