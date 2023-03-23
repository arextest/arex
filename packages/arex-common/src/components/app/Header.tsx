import { LogoutOutlined, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Avatar, Dropdown, DropdownProps, Space, Switch, theme, Typography } from 'antd';
import React, { FC, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { HttpContext } from '../../providers/ArexCommonProvider';
// import { useNavigate, useParams } from 'react-router-dom';
// import { EmailKey } from '../../constant';
// import { getLocalStorage } from '../../helpers/utils';
// import { useCustomNavigate } from '../../router/useCustomNavigate';
// import { useStore } from '../../store';
// import useUserProfile from '../../store/useUserProfile';
import TooltipButton from '../TooltipButton';
// import { PagesType } from '../panes';
// import InviteWorkspace from '../workspace/Invite';
import GitHubStarButton from './GitHubStarButton';

const { useToken } = theme;
interface AppHeaderProps {
  onClickDarkMode: (c: boolean) => void;
}
const AppHeader: FC<AppHeaderProps> = ({ onClickDarkMode }) => {
  const token = useToken();

  const HeaderWrapper = styled.div`
  height: 46px;
  padding: 7px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${token.token.colorBorder}};

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
  const { t } = useTranslation();

  // const { avatar, theme } = useUserProfile();
  // const { logout } = useStore();
  const { store, dispatch } = useContext(HttpContext);
  // const email = getLocalStorage<string>(EmailKey);
  // const params = useParams();
  // const customNavigate = useCustomNavigate();
  const handleSetting = () => {
    // customNavigate(`/${params.workspaceId}/${PagesType.Setting}/${'SETTING'}`);
  };

  const handleLogout = () => {
    // logout();
    // nav('/login');
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
    [],
  );

  return (
    <HeaderWrapper>
      <div className={'left'}>
        <Typography.Text className={'app-name'}>AREX</Typography.Text>
        <GitHubStarButton theme={store.darkMode ? 'dark' : 'light'} />
      </div>

      <Space className={'right'} size='small'>
        <Switch
          checkedChildren='Dark'
          unCheckedChildren='Light'
          onChange={(checked, event) => {
            onClickDarkMode(checked);
          }}
        />
        <TooltipButton
          title={`t('help')`}
          icon={<QuestionCircleOutlined />}
          onClick={() => window.open('https://arextest.github.io/website/zh-Hans/')}
        />
        <TooltipButton title={`t('setting')`} icon={<SettingOutlined />} onClick={handleSetting} />
        <Dropdown menu={userMenu}>
          <Avatar src={'avatar'} size={24} style={{ marginLeft: '0px', cursor: 'pointer' }}>
            {'tzhangm'}
          </Avatar>
        </Dropdown>
      </Space>
    </HeaderWrapper>
  );
};

export default AppHeader;
