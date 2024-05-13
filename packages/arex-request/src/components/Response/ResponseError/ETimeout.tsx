import Icon from '@ant-design/icons';
import { FlexCenterWrapper } from '@arextest/arex-core';
import { Typography } from 'antd';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

const ETimeout: FC = () => {
  const { t } = useTranslation();

  return (
    <FlexCenterWrapper>
      <Icon
        style={{ margin: '8px' }}
        component={() => (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='lucide lucide-hourglass'
          >
            <path d='M5 22h14' />
            <path d='M5 2h14' />
            <path d='M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22' />
            <path d='M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2' />
          </svg>
        )}
      />

      <Typography.Text type='secondary'>{t('error.e_timeout')}</Typography.Text>
      {/* TODO: resend button */}
      {/*<Button type='primary' style={{ marginTop: '8px' }}>*/}
      {/*  {t('error.resend')}*/}
      {/*</Button>*/}
    </FlexCenterWrapper>
  );
};

export default ETimeout;
