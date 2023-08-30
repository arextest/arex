import { LogoutOutlined, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { ArexPanesType, getLocalStorage, TooltipButton, useTranslation } from '@arextest/arex-core';
import { Avatar, Dropdown, DropdownProps, Space } from 'antd';
import React, { FC, useCallback, useMemo } from 'react';
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

  const handleHelpClick = useCallback(
    () =>
      navPane({
        id: 'document',
        type: ArexPanesType.WEB_VIEW,
        name: t('document') as string,
        data: {
          url: 'http://arextest.com/docs/intro',
        },
      }),
    [t],
  );

  return (
    <Space size='small'>
      <TooltipButton
        title={t('help')}
        icon={<QuestionCircleOutlined />}
        onClick={handleHelpClick}
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
          {email?.slice(0, 1).toUpperCase() || 'G'}
        </Avatar>
      </Dropdown>
    </Space>
  );
};

export default HeaderMenu;
