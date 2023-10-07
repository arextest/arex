import { CodeOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Button, Typography } from 'antd';
import React, { FC, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import VConsole from 'vconsole';

import { CheckOrCloseIcon } from '../components';
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
  .ant-btn-link {
    .ant-typography-secondary {
      transition: color 0.25s ease;
      &:hover {
        color: ${(props) => props.theme.colorTextSecondary};
      }
    }
  }
`;

export type ArexFooterProps = {
  left?: React.ReactNode;
  right?: React.ReactNode;
};

const ArexFooter: FC<ArexFooterProps> = (props) => {
  const { theme } = useArexCoreConfig();
  const { t } = useTranslation();
  const vConsole = useRef<VConsole>();

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
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
    }
  }, []);

  return (
    <FooterWrapper>
      {/* left */}
      <div>
        <Button
          id='arex-console-btn'
          type='link'
          size='small'
          onClick={() => vConsole.current?.show()}
        >
          <Typography.Text type='secondary'>
            <CodeOutlined /> {t('console')}
          </Typography.Text>
        </Button>
        {props.left}
      </div>

      {/* right */}
      <div>
        {props.right}
        <span>
          {/* @ts-ignore */}
          <CheckOrCloseIcon size={12} checked={window.__AREX_EXTENSION_INSTALLED__} />
          <Typography.Text type='secondary'>{t('browserAgent')}</Typography.Text>
        </span>
      </div>
    </FooterWrapper>
  );
};

export default ArexFooter;
