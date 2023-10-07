import { LogoutOutlined, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
import {
  ArexPanesType,
  getLocalStorage,
  I18nextLng,
  TooltipButton,
  useTranslation,
} from '@arextest/arex-core';
import { Avatar, Dropdown, DropdownProps, Space } from 'antd';
import React, { FC, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { EMAIL_KEY, PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { useUserProfile } from '@/store';

import globalStoreReset from '../utils/globalStoreReset';

const HeaderMenu: FC = () => {
  const { avatar, language } = useUserProfile();
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
          url: `http://www.arextest.com/${
            language === I18nextLng.cn ? 'zh-Hans/' : ''
          }docs/chapter1/get-started`,
        },
      }),
    [t, language],
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
          navPane({
            id: 'setting',
            type: PanesType.SYSTEM_SETTING,
            name: t('systemSetting') as string,
          });
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
