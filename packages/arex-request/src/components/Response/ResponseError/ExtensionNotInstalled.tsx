import Icon from '@ant-design/icons';
import { FlexCenterWrapper } from '@arextest/arex-core';
import { Button, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { AREX_EXTENSION_CHROME_STORE_UEL } from '../../../constant';

const ExtensionNotInstalled = () => {
  const { t } = useTranslation();

  return (
    <FlexCenterWrapper>
      <Icon
        style={{ margin: '8px' }}
        component={() => (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='18'
            height='18'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='lucide lucide-plug-zap'
          >
            <path d='M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z' />
            <path d='m2 22 3-3' />
            <path d='M7.5 13.5 10 11' />
            <path d='M10.5 16.5 13 14' />
            <path d='m18 3-4 4h6l-4 4' />
          </svg>
        )}
      />

      <Typography.Text type='secondary'>{t('error.extensionNotInstalled')}</Typography.Text>
      <Button type='link' target='_blank' href={AREX_EXTENSION_CHROME_STORE_UEL}>
        {t('error.downloadExtension')}
      </Button>
    </FlexCenterWrapper>
  );
};

export default ExtensionNotInstalled;
