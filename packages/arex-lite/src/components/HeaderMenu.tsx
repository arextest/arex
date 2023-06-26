import { LogoutOutlined, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, DropdownProps, Space, Switch } from 'antd';
import {
  I18_KEY,
  i18n,
  I18nextLng,
  Theme,
  TooltipButton,
  useTranslation,
} from '@arextest/arex-core';
import React, { FC, useMemo } from 'react';

import { useUserProfile } from '../store';

const HeaderMenu: FC = () => {
  const { theme, setTheme } = useUserProfile();
  const { t } = useTranslation();

  const handleLogout = () => {
    console.log('logout');
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

  const handleClickSetting = () => {
    console.log('setting');
  };

  return (
    <Space size='small'>
      <Switch
        defaultChecked={theme === Theme.dark}
        checkedChildren='🌛'
        unCheckedChildren='🌞'
        onChange={(dark) => {
          const theme = dark ? Theme.dark : Theme.light;
          setTheme(theme);
        }}
      />
      <Switch
        defaultChecked={localStorage.getItem(I18_KEY) === I18nextLng.cn}
        checkedChildren='中'
        unCheckedChildren='Eng'
        onChange={(zh) => {
          const lang = zh ? I18nextLng.cn : I18nextLng.en;
          localStorage.setItem(I18_KEY, lang);
          i18n.changeLanguage(lang);
        }}
      />

      <TooltipButton
        title={t('help')}
        icon={<QuestionCircleOutlined />}
        onClick={() => window.open('http://www.arextest.com/')}
      />

      <TooltipButton title={t('setting')} icon={<SettingOutlined />} onClick={handleClickSetting} />
      <Dropdown menu={userMenu}>
        <Avatar src={'avatar'} size={24} style={{ marginLeft: '0px', cursor: 'pointer' }}>
          {'A'}
        </Avatar>
      </Dropdown>
    </Space>
  );
};

export default HeaderMenu;
