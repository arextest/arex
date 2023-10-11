import { css, FlexCenterWrapper } from '@arextest/arex-core';
import { Empty, Tag, theme, Typography } from 'antd';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ArexTestResult } from '../../types';

const TestResult: FC<{ testResult?: ArexTestResult[] }> = ({ testResult }) => {
  const { token } = theme.useToken();
  const { t } = useTranslation();

  return (
    <div>
      {testResult?.map((tr, index) =>
        tr.passed ? (
          <div key={index}>
            <Tag color={token.colorSuccess}>{t('test.passed')}</Tag>
            <Typography.Text type='secondary' style={{ fontSize: '12px !important' }}>
              {tr.name}
            </Typography.Text>
          </div>
        ) : (
          <div key={index}>
            <Tag color={token.colorError}>{t('test.failed')}</Tag>
            <Typography.Text type='secondary' style={{ fontSize: '12px !important' }}>
              {tr.name} | AssertionError: {tr?.error}
            </Typography.Text>
          </div>
        ),
      )}

      {!testResult?.length && (
        <FlexCenterWrapper>
          <Empty
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
          />
        </FlexCenterWrapper>
      )}
    </div>
  );
};

export default TestResult;
