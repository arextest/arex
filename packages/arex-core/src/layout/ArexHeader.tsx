import styled from '@emotion/styled';
import { Typography } from 'antd';
import React, { FC } from 'react';

import { GithubStarButton } from '../components';
import { useArexCoreConfig } from '../hooks';

export interface AppHeaderProps {
  menu?: React.ReactNode;
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
    .app-name {
      width: 90px;
      text-align: center;
      font-weight: 600;
      display: inline-block;
      border-radius: 0.25rem;
      font-size: 14px;
      cursor: default;
    }
  `;

const ArexHeader: FC<AppHeaderProps> = (props) => {
  const { theme } = useArexCoreConfig();

  return (
    <HeaderWrapper>
      <div className={'left'}>
        <Typography.Text className={'app-name'}>AREX</Typography.Text>
        <GithubStarButton theme={theme} />
      </div>

      <div className={'right'}>{props.menu}</div>
    </HeaderWrapper>
  );
};

export default ArexHeader;
