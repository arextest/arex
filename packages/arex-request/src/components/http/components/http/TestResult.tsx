import { css } from '@emotion/react';
import { Empty, Tag, Typography } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import SmartLink from '../smart/Link';
const { Text, Link } = Typography;

const testResultWrap = css`
  padding: 10px;
  padding-bottom: 0;
`;
function NoTestResult() {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <Empty description={''} />
      <Text
        css={css`
          font-weight: 600;
          padding: 10px 0;
        `}
      >
        There are no tests for this request
      </Text>
      <Text
        css={css`
          font-size: 12px;
        `}
        type='secondary'
      >
        Write a test script to automate debugging. Learn more about{' '}
      </Text>
      <SmartLink href={'https://learning.postman.com/docs/writing-scripts/test-scripts/'}>
        writing tests
      </SmartLink>
    </div>
  );
}
const TestResult: FC<{ testResult: any }> = ({ testResult }) => {
  const { t } = useTranslation();
  return (
    <div>
      {testResult.map((tr: any, index: number) => {
        if (tr.passed) {
          return (
            <div css={testResultWrap} key={index}>
              <Tag color={'#0cbb52'}>{t('test.passed')}</Tag>
              <Text
                type='secondary'
                css={css`
                  font-size: 12px !important;
                `}
              >
                {tr.name}
              </Text>
            </div>
          );
        } else {
          return (
            <div css={testResultWrap} key={index}>
              <Tag color={'#eb2013'}>{t('test.failed')}</Tag>
              <Text
                type='secondary'
                css={css`
                  font-size: 12px !important;
                `}
              >
                {tr.name} | AssertionError: {tr.error.message}
              </Text>
            </div>
          );
        }
      })}
      {testResult.length === 0 && <NoTestResult />}
    </div>
  );
};

export default TestResult;
