import { LogoutOutlined, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, DropdownProps, Space } from 'antd';
import { getLocalStorage, setLocalStorage, TooltipButton, useTranslation } from 'arex-core';
import React, { FC, useMemo } from 'react';

import { EMAIL_KEY, PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { useMenusPanes, useUserProfile } from '@/store';

const HeaderMenu: FC = () => {
  const { reset } = useMenusPanes();
  const { avatar } = useUserProfile();
  const { t } = useTranslation();
  const email = getLocalStorage(EMAIL_KEY) as string;
  const navPane = useNavPane();

  const handleLogout = () => {
    reset();
    localStorage.clear();
    email?.startsWith('GUEST') && setLocalStorage(EMAIL_KEY, email);
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
        onClick={() => window.open('https://arextest.github.io/website/zh-Hans/')}
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
