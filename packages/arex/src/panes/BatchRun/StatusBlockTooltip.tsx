import { Label, useTranslation } from '@arextest/arex-core';
import { theme } from 'antd';
import React, { FC } from 'react';

import StatusBlock from './StatusBlock';

const StatusBlockTooltip: FC = () => {
  const { token } = theme.useToken();
  const { t } = useTranslation('page');

  return (
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
        <StatusBlock color={token.colorFillSecondary} text={t('batchRunPage.noTestScript')} />
        <StatusBlock color={token.colorSuccess} text={t('batchRunPage.allPassed')} />
        <br />
        <StatusBlock color={token.colorWarning} text={t('batchRunPage.SomeFailed')} />
        <StatusBlock color={token.colorError} text={t('batchRunPage.allFailed')} />
      </div>
    </>
  );
};

export default StatusBlockTooltip;
