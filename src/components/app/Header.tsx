import { LogoutOutlined, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Avatar, Dropdown, DropdownProps, Space, Typography } from 'antd';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { EmailKey } from '../../constant';
import { getLocalStorage } from '../../helpers/utils';
import { useCustomNavigate } from '../../router/useCustomNavigate';
import { useStore } from '../../store';
import useUserProfile from '../../store/useUserProfile';
import { TooltipButton } from '../index';
import { PagesType } from '../panes';
import InviteWorkspace from '../workspace/Invite';
import GitHubStarButton from './GitHubStarButton';

const HeaderWrapper = styled.div`
  height: 46px;
  padding: 7px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${(props) => props.theme.colorBorder};

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

const AppHeader = () => {
  const nav = useNavigate();
  const { t, i18n } = useTranslation('common');

  const { avatar, theme } = useUserProfile();
  const { logout } = useStore();
  const email = getLocalStorage<string>(EmailKey);
  const params = useParams();
  const customNavigate = useCustomNavigate();
  const handleSetting = () => {
    customNavigate(`/${params.workspaceId}/${PagesType.Setting}/${'SETTING'}`);
  };

  const handleLogout = () => {
    logout();
    nav('/login');
  };

  const userMenu: DropdownProps['menu'] = useMemo(
    () => ({
      items: [
        {
          key: 'logout',
          label: t('logout'),
          icon: <LogoutOutlined />,
        },
      ],
      onClick: (e) => {
        if (e.key === 'logout') {
          handleLogout();
        }
      },
    }),
    [i18n.language],
  );

  return (
    <HeaderWrapper>
      <div className={'left'}>
        <Typography.Text className={'app-name'}>AREX</Typography.Text>
        <GitHubStarButton theme={theme} />
      </div>

      <Space className={'right'} size='small'>
        {!email?.match('GUEST') && <InviteWorkspace />}
        <TooltipButton
          title={t('help')}
          icon={<QuestionCircleOutlined />}
          onClick={() => window.open('https://arextest.github.io/website/zh-Hans/')}
        />
        <TooltipButton title={t('setting')} icon={<SettingOutlined />} onClick={handleSetting} />
        <Dropdown menu={userMenu}>
          <Avatar src={avatar} size={24} style={{ marginLeft: '0px', cursor: 'pointer' }}>
            {email?.[0].toUpperCase()}
          </Avatar>
        </Dropdown>
      </Space>
    </HeaderWrapper>
  );
};

export default AppHeader;
