import { CodeOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Button, Tooltip, Typography } from 'antd';
import React, { FC, ReactNode, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import VConsole from 'vconsole';

import { CheckOrCloseIcon, SmallTextButton } from '../components';
import { useArexCoreConfig } from '../hooks';

const FooterWrapper = styled.div`
  height: 26px;
  width: 100%;
  padding: 0 8px;
  display: flex;
  justify-content: space-between;
  z-index: 1000;
  border-top: 1px solid ${(props) => props.theme.colorBorder};
  .ant-typography {
    line-height: 24px;
    font-size: 12px;
  }
  .ant-btn-icon {
    font-size: 12px;
    margin-inline-end: 6px;
  }
  .ant-btn-link {
    .ant-typography-secondary {
      transition: color 0.25s ease;
      &:hover {
        color: ${(props) => props.theme.colorTextSecondary};
      }
    }
  }
`;

const Console: FC = () => {
  const vConsole = useRef<VConsole>();
  const { theme } = useArexCoreConfig();
  const { t } = useTranslation();

  useEffect(() => {
    vConsole.current = new VConsole({
      theme,
      log: {
        showTimestamps: true,
      },
      defaultPlugins: [],
      pluginOrder: ['logs'],
    });
    vConsole.current.hideSwitch();

    return () => vConsole.current?.destroy();
  }, []);

  return (
    <Tooltip title={t('console')}>
      <Button
        id='arex-console-btn'
        size='small'
        type='link'
        onClick={() => vConsole.current?.show()}
      >
        <CodeOutlined />
      </Button>
    </Tooltip>
  );
};

const Agent: FC = () => {
  const { t } = useTranslation();
  return (
    <SmallTextButton
      type='link'
      color='secondary'
      icon={<CheckOrCloseIcon size={12} checked={window.__AREX_EXTENSION_INSTALLED__} />}
      title={<Typography.Text type='secondary'>{t('browserAgent')}</Typography.Text>}
    />
  );
};

export type ArexFooterProps = {
  leftRender?: (console: React.ReactNode) => React.ReactNode;
  rightRender?: (agent: React.ReactNode) => React.ReactNode;
};

const ArexFooter: FC<ArexFooterProps> = (props) => {
  const { leftRender = (console) => console, rightRender = (agent) => agent } = props;

  return (
    <FooterWrapper>
      {/* left */}
      <div>{leftRender(<Console />)}</div>

      {/* right */}
      <div>{rightRender(<Agent />)}</div>
    </FooterWrapper>
  );
};

export default ArexFooter;
