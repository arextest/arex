import { Label, useTranslation } from '@arextest/arex-core';
import { Button } from 'antd';
import React, { FC } from 'react';

const SystemLogs: FC = () => {
  const { t } = useTranslation('components');
  return (
    <>
      <Label offset={-8}>{t('systemSetting.systemLogs')}</Label>
      <Button type={'link'} href={'/logs'} target='_blank'>
        {t('systemSetting.openSystemLogs')}
      </Button>
    </>
  );
};

export default SystemLogs;
