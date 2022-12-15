import { SettingOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Avatar, Divider, Dropdown, Typography } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { EmailKey } from '../../constant';
import { generateGlobalPaneId, getLocalStorage } from '../../helpers/utils';
import { PagesType } from '../../pages';
import { useStore } from '../../store';
import useUserProfile from '../../store/useUserProfile';
import GitHubStarButton from '../GitHubStarButton';
import { TooltipButton } from '../index';
import InviteWorkspace from '../workspace/Invite';

const HeaderWrapper = styled.div`
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
`;

const AppHeader = () => {
  const nav = useNavigate();
  const { theme } = useUserProfile();
  const { logout, setPages } = useStore();
  const email = getLocalStorage<string>(EmailKey);

  const handleSetting = () => {
    setPages(
      {
        title: 'Setting',
        pageType: PagesType.Setting,
        isNew: false,
        data: undefined,
        paneId: generateGlobalPaneId('-', PagesType.Setting, 'SETTING'),
        rawId: 'SETTING',
      },
      'push',
    );
  };

  const handleLogout = () => {
    logout();
    nav('/login');
  };

  return (
    <div>
      <HeaderWrapper>
        <div className={'left'}>
          <Typography.Text className={'app-name'}>AREX</Typography.Text>
          <GitHubStarButton theme={theme} />
        </div>

        <div className={'right'}>
          {!(email || '').match('GUEST') && <InviteWorkspace />}
          <TooltipButton icon={<SettingOutlined />} title='Setting' onClick={handleSetting} />

          <Dropdown
            overlayStyle={{ width: '170px' }}
            menu={{
              items: [
                {
                  key: 'signOut',
                  label: 'Sign Out',
                },
              ],
              onClick: (e) => {
                if (e.key === 'signOut') {
                  handleLogout();
                }
              },
            }}
          >
            <Avatar size={24} style={{ marginLeft: '8px', cursor: 'pointer' }}>
              {/*// @ts-ignore*/}
              {email[0].toUpperCase()}
            </Avatar>
          </Dropdown>
        </div>
      </HeaderWrapper>

      <Divider style={{ margin: '0' }} />
    </div>
  );
};

export default AppHeader;
