import { QuestionCircleOutlined } from '@ant-design/icons';
import { Label, useTranslation } from '@arextest/arex-core';
import { ArexResponse } from '@arextest/arex-request';
import { Popover, theme } from 'antd';
import React, { FC, useMemo } from 'react';

import StatusBlock from '@/panes/BatchRun/StatusBlock';

export type StatusBlockStructureProps = {
  data?: Record<string, ArexResponse>;
};
const StatusBlockStructure: FC<StatusBlockStructureProps> = (props) => {
  const { token } = theme.useToken();
  const { t } = useTranslation('page');

  const memoizedEntries = useMemo(() => {
    return Object.entries(props.data || {});
  }, [props.data]);

  if (!props.data || !Object.values(props.data).length) return null;
  return (
    <div style={{ padding: '0 16px 4px', marginBottom: '4px' }}>
      <div style={{ display: 'flex' }}>
        {memoizedEntries.map(([id, item], index) => {
          const testAllSuccess = item.testResult?.every((test) => test.passed) ?? true;
          const testAllFail = item.testResult?.every((test) => !test.passed) ?? false;

          const requestStatusColor =
            item.response.type === 'loading'
              ? token.colorFillSecondary
              : item.response?.statusCode < 300
              ? token.colorSuccess
              : item.response?.statusCode < 400
              ? token.colorWarning
              : token.colorError;

          const testResultStatusColor = item.testResult?.length
            ? testAllSuccess
              ? token.colorSuccess
              : testAllFail
              ? token.colorError
              : token.colorWarning
            : token.colorFillSecondary;

          return (
            <div
              key={index}
              onClick={() => {
                const element = document.getElementById(`batch-run-result-item-${id}`);
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                width: '16px',
                cursor: 'pointer',
                margin: `0 ${
                  memoizedEntries.length > 100 ? 2 : memoizedEntries.length > 50 ? 3 : 4
                }px `,
              }}
            >
              <div
                style={{
                  height: '6px',
                  backgroundColor: requestStatusColor,
                }}
              />
              <div
                style={{
                  height: '6px',
                  backgroundColor: testResultStatusColor,
                }}
              />
            </div>
          );
        })}

        <Popover
          title={
            <>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Label>{t('batchRunPage.statusBlockStructure')}</Label>
                <div style={{ display: 'inline-block' }}>
                  <div
                    style={{
                      textAlign: 'center',
                      backgroundColor: token.colorSuccess,
                      fontSize: '10px',
                      padding: '0 4px',
                      color: token.colorWhite,
                    }}
                  >
                    {t('batchRunPage.requestStatus')}
                  </div>
                  <div
                    style={{
                      textAlign: 'center',
                      backgroundColor: token.colorError,
                      fontSize: '10px',
                      padding: '0 4px',
                      color: token.colorWhite,
                    }}
                  >
                    {t('batchRunPage.testStatus')}
                  </div>
                </div>
              </div>

              <div>
                <Label>{t('batchRunPage.requestStatus')}</Label>
                <StatusBlock color={token.colorFillSecondary} text={t('batchRunPage.loading')} />
                <StatusBlock color={token.colorSuccess} text={t('batchRunPage.requestSuccess')} />
                <StatusBlock color={token.colorError} text={t('batchRunPage.requestFailed')} />
              </div>
              <div>
                <Label>{t('batchRunPage.testStatus')}</Label>
                <StatusBlock
                  color={token.colorFillSecondary}
                  text={t('batchRunPage.noTestScript')}
                />
                <StatusBlock color={token.colorSuccess} text={t('batchRunPage.allPassed')} />
                <br />
                <StatusBlock color={token.colorWarning} text={t('batchRunPage.SomeFailed')} />
                <StatusBlock color={token.colorError} text={t('batchRunPage.allFailed')} />
              </div>
            </>
          }
          placement='bottomRight'
          overlayStyle={{ maxWidth: '500px' }}
        >
          <QuestionCircleOutlined
            style={{
              margin: '0 4px',
              display: Object.values(props.data).length ? 'inherit' : 'none',
            }}
          />
        </Popover>
      </div>
    </div>
  );
};

export default StatusBlockStructure;
