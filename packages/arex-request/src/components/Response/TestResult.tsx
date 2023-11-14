import { css, EmptyWrapper } from '@arextest/arex-core';
import { Space, Tag, theme, Typography } from 'antd';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ArexTestResult } from '../../types';

const TestResult: FC<{ testResult?: ArexTestResult[] }> = ({ testResult }) => {
  const { token } = theme.useToken();

  const { t } = useTranslation();

  return (
    <EmptyWrapper
      empty={!testResult?.length}
      description={
        <>
          <Typography.Text strong style={{ display: 'block' }}>
            There are no tests for this request
          </Typography.Text>
          <Typography.Text
            css={css`
              font-size: 12px;
            `}
            type='secondary'
          >
            Write a test script to automate debugging. Learn more about{' '}
          </Typography.Text>
          <a
            href={'https://learning.postman.com/docs/writing-scripts/test-scripts/'}
            target={'_blank'}
            rel='noreferrer'
          >
            writing tests
          </a>
        </>
      }
    >
      <Space direction='vertical' size='middle' style={{ width: '100%', padding: '8px' }}>
        {testResult?.map((tr, index) => (
          <div key={index}>
            <div style={{ display: 'inline-block', width: '64px', textAlign: 'center' }}>
              {tr.passed ? (
                <Tag color={token.colorSuccess}>{t('test.passed')}</Tag>
              ) : (
                <Tag color={token.colorError}>{t('test.failed')}</Tag>
              )}
            </div>

            <Typography.Text type='secondary' style={{ fontSize: '12px !important' }}>
              {tr.name} {!tr.passed && `| ${tr?.error?.name}: ${tr?.error?.message}`}
            </Typography.Text>
          </div>
        ))}
      </Space>
    </EmptyWrapper>
  );
};

export default TestResult;
