// @ts-nocheck
import { css } from '@emotion/react';
import { List, Progress } from 'antd';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { CheckOrCloseIcon } from '../../../styledComponents';
import { HoppTestResult } from '../../helpers/types/HoppTestResult';

const TestResult: FC<{ testResult: HoppTestResult | null; mode?: string }> = ({
  testResult,
  mode,
}) => {
  const { t } = useTranslation();

  return testResult?.scriptError ? (
    <div
      css={css`
        background-color: salmon;
      `}
    >
      {t('helpers.test_script_fail')}
    </div>
  ) : (
    <div>
      {testResult?.children?.length ? (
        testResult?.children?.map((result, i) => (
          <List
            bordered
            key={i}
            size='large'
            header={
              mode !== 'simple' ? (
                <div>
                  <div
                    css={css`
                      margin-top: -10px;
                      font-weight: bold;
                    `}
                  >
                    {result.descriptor}
                  </div>
                  <div
                    css={css`
                      margin-top: 10px;
                      display: flex;
                    `}
                  >
                    <Progress
                      strokeColor={'#EF4444'}
                      width={20}
                      strokeWidth={20}
                      percent={100}
                      success={{
                        percent: Math.round(
                          (result.expectResults.filter((i: any) => i.status === 'pass').length /
                            result.expectResults.length) *
                            100,
                        ),
                        strokeColor: '#10B981',
                      }}
                      type='circle'
                      showInfo={false}
                    />
                    <span
                      css={css`
                        margin-left: 10px;
                        display: flex;
                      `}
                    >
                      {result.expectResults.length -
                      result.expectResults.filter((i: any) => i.status === 'pass').length ? (
                        <span
                          css={css`
                            color: #ef4444;
                          `}
                        >
                          {result.expectResults.length -
                            result.expectResults.filter((i: any) => i.status === 'pass')
                              .length}{' '}
                          failing,{' '}
                        </span>
                      ) : (
                        <div></div>
                      )}
                      {result.expectResults.filter((i: any) => i.status === 'pass').length ? (
                        <span
                          css={css`
                            color: #10b981;
                          `}
                        >
                          {result.expectResults.filter((i: any) => i.status === 'pass').length}{' '}
                          successful,{' '}
                        </span>
                      ) : (
                        <div></div>
                      )}
                      out of {result.expectResults.length} tests
                    </span>
                  </div>
                </div>
              ) : (
                false
              )
            }
            dataSource={result.expectResults}
            renderItem={(item, i) => (
              <List.Item key={i}>
                <CheckOrCloseIcon checked={item.status === 'pass'} />
                {item.message} ——
                {item.status === 'pass' ? 'testPassed' : 'testFailed'}
              </List.Item>
            )}
            style={{ marginBottom: '10px' }}
          />
        ))
      ) : (
        <p
          css={css`
            color: orange;
          `}
        >
          {t('helpers.tests')}
        </p>
      )}
    </div>
  );
};

export default TestResult;
