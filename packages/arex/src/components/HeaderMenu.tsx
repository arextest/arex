import { LogoutOutlined, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, DropdownProps, Space } from 'antd';
import { getLocalStorage, TooltipButton, useTranslation } from '@arextest/arex-core';
import React, { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { EMAIL_KEY, PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { useUserProfile } from '@/store';

import globalStoreReset from '../utils/globalStoreReset';

const HeaderMenu: FC = () => {
  const { avatar } = useUserProfile();
  const { t } = useTranslation();
  const email = getLocalStorage(EMAIL_KEY) as string;
  const navPane = useNavPane();
  const nav = useNavigate();

  const handleLogout = () => {
    globalStoreReset();
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
        if (e.key === 'logout') handleLogout();
      },
    }),
    [t],
  );

  return (
    <Space size='small'>
      <TooltipButton
        title={t('help')}
        icon={<QuestionCircleOutlined />}
        onClick={() => window.open('http://www.arextest.com/')}
      />

      <TooltipButton
        title={t('setting')}
        icon={<SettingOutlined />}
        onClick={() => {
          navPane({ id: 'setting', type: PanesType.USER_SETTING });
        }}
      />

      <Dropdown menu={userMenu}>
        <Avatar src={avatar} size={24} style={{ marginLeft: '0px', cursor: 'pointer' }}>
          {email?.slice(0, 1).toUpperCase()}
        </Avatar>
      </Dropdown>
    </Space>
  );
};

export default HeaderMenu;
