import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { getLocalStorage, useTranslation } from '@arextest/arex-core';
import { Avatar, Dropdown, DropdownProps, Space } from 'antd';
import React, { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { EMAIL_KEY, PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { useUserProfile } from '@/store';

import globalStoreReset from '../utils/globalStoreReset';

const UserMenu: FC = () => {
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
          key: 'setting',
          label: t('setting'),
          icon: <SettingOutlined />,
        },
        {
          key: 'logout',
          label: t('logout'),
          icon: <LogoutOutlined />,
        },
      ],
      onClick: (e) => {
        if (e.key === 'logout') handleLogout();
        else if (e.key === 'setting') {
          navPane({
            id: 'setting',
            type: PanesType.SYSTEM_SETTING,
            name: t('systemSetting') as string,
          });
        }
      },
    }),
    [t],
  );

  return (
    <Space size='small'>
      <Dropdown menu={userMenu}>
        <Avatar src={avatar} size={24} style={{ marginLeft: '0px', cursor: 'pointer' }}>
          {email?.slice(0, 1).toUpperCase() || 'G'}
        </Avatar>
      </Dropdown>
    </Space>
  );
};

export default UserMenu;
