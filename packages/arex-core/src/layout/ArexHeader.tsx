import { LogoutOutlined, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Avatar, Dropdown, DropdownProps, Space, Switch, theme, Typography } from 'antd';
import React, { FC, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import GithubStarButton from '../components/GithubStarButton';
import TooltipButton from '../components/TooltipButton';
import { HttpContext } from '../providers/ArexCoreProvider';

const { useToken } = theme;
interface AppHeaderProps {
  onDarkModeChange?: (dark: boolean) => void;
  onSetting?: () => void;
  onLogout?: () => void;
}
const ArexHeader: FC<AppHeaderProps> = (props) => {
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
  const { store } = useContext(HttpContext);

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
        <GithubStarButton theme={store.darkMode ? 'dark' : 'light'} />
      </div>

      <Space className={'right'} size='small'>
        {props.onDarkModeChange && (
          <Switch checkedChildren='🌛' unCheckedChildren='🌞' onChange={props.onDarkModeChange} />
        )}
        <TooltipButton
          title={`t('help')`}
          icon={<QuestionCircleOutlined />}
          onClick={() => window.open('https://arextest.github.io/website/zh-Hans/')}
        />
        {props.onSetting && (
          <TooltipButton
            title={`t('setting')`}
            icon={<SettingOutlined />}
            onClick={props.onSetting}
          />
        )}
        <Dropdown menu={userMenu}>
          <Avatar src={'avatar'} size={24} style={{ marginLeft: '0px', cursor: 'pointer' }}>
            {'A'}
          </Avatar>
        </Dropdown>
      </Space>
    </HeaderWrapper>
  );
};

export default ArexHeader;
