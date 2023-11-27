/// <reference types="vite-plugin-svgr/client" />
import styled from '@emotion/styled';
import { useSize } from 'ahooks';
import { Typography } from 'antd';
import React, { FC } from 'react';

import { ReactComponent as LogoIconDark } from '../../assets/svg/logo_dark.svg';
import { ReactComponent as LogoIconLight } from '../../assets/svg/logo_light.svg';
import { GithubStarButton } from '../components';
import { useArexCoreConfig } from '../hooks';

export interface AppHeaderProps extends HTMLDivElement {
  logo?: boolean;
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
  -webkit-app-region: drag;
  border-bottom: 1px solid ${(props) => props.theme.colorBorder}};
    .left,
    .right {
      display: flex;
      align-items: center;
      -webkit-app-region: no-drag;
    }
    .logo {
      margin-top: 2px ;
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: center;
      width: 72px;
  `;

const ArexHeader: FC<AppHeaderProps> = (props) => {
  const { logo = true, githubStar = true } = props;
  const { theme } = useArexCoreConfig();

  const size = useSize(document.getElementById('arex-menu'));

  return (
    <HeaderWrapper className={props.className}>
      <div className={'left'}>
        <a
          className={'logo'}
          target='_blank'
          href={'http://arextest.com'}
          rel='noreferrer'
          style={{ opacity: logo ? 100 : 0, width: (size?.width || 72) - 14 }}
        >
          {React.createElement(theme === 'dark' ? LogoIconDark : LogoIconLight, {
            style: { height: '18px' },
          })}

          <Typography.Text
            strong
            style={{ lineHeight: '14px', paddingLeft: '2px', transform: 'scale(0.7)' }}
          >
            AREX
          </Typography.Text>
        </a>
        {githubStar && <GithubStarButton />}
        {props.menu}
      </div>

      <div className={'right'}>{props.extra}</div>
    </HeaderWrapper>
  );
};

export default ArexHeader;
