import { SettingOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Avatar, Button, Divider, Dropdown, Menu } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Setting from '../../pages/Setting';
import { useStore } from '../../store';
import { Theme, ThemeIcon } from '../../style/theme';
import InviteWorkspace from '../workspace/Invite';
import AppGitHubStarButton from './GitHubStarButton';

const HeaderWrapper = styled.div`
  .app-header {
    height: 46px;
    padding: 7px;
    display: flex;
    justify-content: space-between;

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
  }
`;

const AppHeader = () => {
  const nav = useNavigate();
  const { theme, changeTheme, userInfo, logout } = useStore();
  const [isSettingModalVisible, setIsSettingModalVisible] = useState(false);

  const handleLogout = () => {
    logout();
    nav('/login');
  };
  return (
    <HeaderWrapper>
      <div className={'app-header'}>
        <div className={'left'}>
          <span className={'app-name'}>AREX</span>
          <AppGitHubStarButton />
        </div>

        <div className={'right'}>
          <InviteWorkspace />

          <Button
            type='text'
            icon={theme === Theme.light ? ThemeIcon.dark : ThemeIcon.light}
            onClick={() => changeTheme()}
          />

          <Dropdown
            overlayStyle={{ width: '170px' }}
            trigger={['click']}
            overlay={
              <Menu
                items={[
                  {
                    key: 'settings',
                    label: 'Settings',
                  },
                  {
                    type: 'divider',
                  },
                  {
                    key: '1',
                    label: 'Privacy Policy',
                    disabled: true,
                  },
                  {
                    key: '2',
                    label: 'Terms',
                    disabled: true,
                  },
                ]}
                onClick={(e) => {
                  if (e.key === 'settings') {
                    setIsSettingModalVisible(true);
                  }
                }}
              />
            }
          >
            <Button type='text' icon={<SettingOutlined />} style={{ color: '#6B6B6B' }} />
          </Dropdown>

          <Dropdown
            trigger={['click']}
            overlayStyle={{ width: '170px' }}
            overlay={
              <Menu
                items={[
                  {
                    key: 'signOut',
                    label: 'Sign Out',
                  },
                ]}
                onClick={(e) => {
                  if (e.key === 'signOut') {
                    handleLogout();
                  }
                }}
              />
            }
          >
            <Avatar size={20} style={{ marginLeft: '8px', cursor: 'pointer' }}>
              {userInfo?.email}
            </Avatar>
          </Dropdown>
        </div>
      </div>

      <Divider style={{ margin: '0' }} />

      {/*模态框*/}
      <Setting visible={isSettingModalVisible} onCancel={() => setIsSettingModalVisible(false)} />
    </HeaderWrapper>
  );
};

export default AppHeader;
