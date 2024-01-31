import styled from '@emotion/styled';
import React, { FC } from 'react';

import { GithubStarButton } from '../components';
import ArexLogo from '../components/ArexLogo';

export interface AppHeaderProps {
  className?: string;
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

  return (
    <HeaderWrapper className={props.className}>
      <div className={'left'}>
        {logo && <ArexLogo />}
        {githubStar && <GithubStarButton />}
        {props.menu}
      </div>

      <div className={'right'}>{props.extra}</div>
    </HeaderWrapper>
  );
};

export default ArexHeader;
