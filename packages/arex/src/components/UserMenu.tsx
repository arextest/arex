import { getLocalStorage, useTranslation } from '@arextest/arex-core';
import { Avatar, Badge, Dropdown, DropdownProps, Space } from 'antd';
import React, { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { EMAIL_KEY, PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { useMessageQueue, useUserProfile } from '@/store';

import globalStoreReset from '../utils/globalStoreReset';
import Icon from './Icon';

const UserMenu: FC = () => {
  const { avatar } = useUserProfile();
  const { messageQueue } = useMessageQueue();
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
          label: (
            <Badge dot={!!messageQueue.length} offset={[3, 0]}>
              {t('setting')}
            </Badge>
          ),
          icon: <Icon name='Settings' />,
        },
        {
          key: 'logout',
          label: t('logout'),
          icon: <Icon name='LogOut' />,
        },
      ],
      onClick: (e) => {
        if (e.key === 'logout') handleLogout();
        else if (e.key === 'setting') {
          navPane({
            id: 'setting',
            type: PanesType.SYSTEM_SETTING,
            name: false,
          });
        }
      },
    }),
    [t, messageQueue],
  );

  return (
    <Space size='small'>
      <Dropdown menu={userMenu} trigger={['click']}>
        <Badge dot={!!messageQueue.length} offset={[-3, 3]}>
          <Avatar src={avatar} size={24} style={{ marginLeft: '0px', cursor: 'pointer' }}>
            {email?.slice(0, 1).toUpperCase() || 'G'}
          </Avatar>
        </Badge>
      </Dropdown>
    </Space>
  );
};

export default UserMenu;
