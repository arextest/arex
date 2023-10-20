import Icon, {
  CommentOutlined,
  CompassOutlined,
  GithubOutlined,
  MacCommandOutlined,
  QqOutlined,
  QuestionCircleOutlined,
  ReadOutlined,
  SlackOutlined,
  WechatOutlined,
} from '@ant-design/icons';
import {
  ArexPanesType,
  FlexCenterWrapper,
  I18nextLng,
  SmallTextButton,
  useTranslation,
} from '@arextest/arex-core';
import { Dropdown, MenuProps, Modal, Typography } from 'antd';
import React, { FC } from 'react';

import { useNavPane } from '@/hooks';
import { useMenusPanes, useUserProfile } from '@/store';

const FooterExtraMenu: FC = () => {
  const navPane = useNavPane();
  const { toggleOpenKeyboardShortcut } = useMenusPanes();
  const { language } = useUserProfile();
  const { t } = useTranslation();
  const [modal, contextHolder] = Modal.useModal();

  const helpMenuItems: MenuProps['items'] = [
    {
      label: t('website'),
      key: 'website',
      icon: <CompassOutlined />,
    },
    {
      label: t('document'),
      key: 'document',
      icon: <ReadOutlined />,
    },
    {
      label: t('shortcuts', { ns: 'shortcuts' }),
      key: 'shortcut',
      icon: <MacCommandOutlined />,
    },
  ];

  const helpMenuHandler: MenuProps['onClick'] = (e) => {
    switch (e.key) {
      case 'website': {
        window.open('http://www.arextest.com');
        break;
      }
      case 'document': {
        navPane({
          id: 'document',
          type: ArexPanesType.WEB_VIEW,
          name: t('document') as string,
          data: {
            url: `http://www.arextest.com/${
              language === I18nextLng.cn ? 'zh-Hans/' : ''
            }docs/chapter1/get-started`,
          },
        });
        break;
      }
      case 'shortcut': {
        toggleOpenKeyboardShortcut();
        break;
      }
    }
  };

  const feedbackMenuItems: MenuProps['items'] = [
    {
      label: 'Github',
      key: 'github',
      icon: <GithubOutlined />,
    },
    {
      label: 'X',
      key: 'x',
      icon: <Icon component={() => <>𝕏</>} />,
    },
    {
      label: 'Slack',
      key: 'slack',
      icon: <SlackOutlined />,
    },
    {
      label: 'QQ',
      key: 'qq',
      icon: <QqOutlined />,
    },
    {
      label: 'Wechat',
      key: 'wechat',
      icon: <WechatOutlined />,
    },
  ];

  const feedbackMenuHandler: MenuProps['onClick'] = (e) => {
    switch (e.key) {
      case 'github': {
        window.open('https://github.com/arextest/arex/issues');
        break;
      }
      case 'x': {
        window.open('https://x.com/AREX_Test');
        break;
      }
      case 'slack': {
        window.open(
          'https://join.slack.com/t/arexcommunity/shared_invite/zt-1pb0qukhd-tnLVZN3aisHfIo5SzBjj0Q',
        );
        break;
      }
      case 'qq': {
        modal.info({
          title: (
            <FlexCenterWrapper>
              <img
                src={'/qqQrcode.jpg'}
                alt='qqQrcode'
                style={{ width: '200px', height: '200px', padding: '16px' }}
              />
              <Typography.Text type='secondary'>{t('scanWithQQ')}</Typography.Text>
              <Typography.Text type='secondary'>{t('joinGroupChat')}</Typography.Text>
            </FlexCenterWrapper>
          ),
          width: 280,
          icon: <></>,
          footer: null,
          maskClosable: true,
        });
        break;
      }
      case 'wechat': {
        modal.info({
          title: (
            <FlexCenterWrapper>
              <img
                src={'/wechatQrcode.bmp'}
                alt='wechatQrcode'
                style={{ width: '200px', height: '200px', padding: '16px' }}
              />
              <Typography.Text type='secondary'>{t('scanWithWechat')}</Typography.Text>
              <Typography.Text type='secondary'>{t('followWechatOfficialAccount')}</Typography.Text>
            </FlexCenterWrapper>
          ),
          width: 280,
          icon: <></>,
          footer: null,
          maskClosable: true,
        });
        break;
      }
    }
  };

  return (
    <>
      <Dropdown
        destroyPopupOnHide
        trigger={['click']}
        menu={{
          items: helpMenuItems,
          onClick: helpMenuHandler,
        }}
      >
        <SmallTextButton
          type='link'
          color='secondary'
          title={t('help')}
          icon={<QuestionCircleOutlined />}
        />
      </Dropdown>

      <Dropdown
        destroyPopupOnHide
        trigger={['click']}
        menu={{
          items: feedbackMenuItems,
          onClick: feedbackMenuHandler,
        }}
      >
        <SmallTextButton
          type='link'
          color='secondary'
          title={t('feedback')}
          icon={<CommentOutlined />}
        />
      </Dropdown>

      {contextHolder}
    </>
  );
};

export default FooterExtraMenu;
