import { LogoutOutlined, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Avatar, Dropdown, DropdownProps, Space, Switch, Typography } from 'antd';
import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import GithubStarButton from '../components/GithubStarButton';
import TooltipButton from '../components/TooltipButton';
import { useArexCoreConfig } from '../hooks';
import { Theme } from '../theme';

export interface AppHeaderProps {
  onThemeChange?: (theme: Theme) => void;
  onSetting?: () => void;
  onLogout?: () => void;
}

const ArexHeader: FC<AppHeaderProps> = (props) => {
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
  const { t } = useTranslation();
  const { theme, setTheme } = useArexCoreConfig();

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
    [t],
  );

  return useMemo(
    () => (
      <HeaderWrapper>
        <div className={'left'}>
          <Typography.Text className={'app-name'}>AREX</Typography.Text>
          <GithubStarButton theme={theme} />
        </div>

        <Space className={'right'} size='small'>
          <Switch
            defaultChecked={theme === Theme.dark}
            checkedChildren='🌛'
            unCheckedChildren='🌞'
            onChange={(dark) => {
              const theme = dark ? Theme.dark : Theme.light;
              props.onThemeChange?.(theme);
              setTheme(theme);
            }}
          />
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
    ),
    [theme, userMenu],
  );
};

export default ArexHeader;
