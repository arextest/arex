import { SettingOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Avatar, Divider, Dropdown, Menu } from 'antd';
import React from 'react';

import { generateGlobalPaneId } from '../../helpers/utils';
import { PagesType } from '../../pages';
import SettingPage from '../../pages/SettingPage';
import { useStore } from '../../store';
import GitHubStarButton from '../GitHubStarButton';
import { TooltipButton } from '../index';
import InviteWorkspace from '../workspace/Invite';

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
  const {
    userInfo: { email },
    themeClassify,
    logout,
    setPages,
  } = useStore();

  const handleSetting = () => {
    setPages(
      {
        // key: '__SETTING__',
        title: 'Setting',
        pageType: PagesType.Setting,
        isNew: false,
        paneId: generateGlobalPaneId('-', PagesType.Setting, 'SETTING'),
        rawId: 'SETTING',
      },
      'push',
    );
  };
  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };
  return (
    <HeaderWrapper>
      <div className={'app-header'}>
        <div className={'left'}>
          <span className={'app-name'}>AREX</span>
          <GitHubStarButton theme={themeClassify} />
        </div>

        <div className={'right'}>
          {!(email || '').match('GUEST') ? <InviteWorkspace /> : null}
          <TooltipButton icon={<SettingOutlined />} title='Setting' onClick={handleSetting} />

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
              {email}
            </Avatar>
          </Dropdown>
        </div>
      </div>

      <Divider style={{ margin: '0' }} />
    </HeaderWrapper>
  );
};

export default AppHeader;
