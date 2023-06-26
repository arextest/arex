import { Button, Empty } from 'antd';
import { FlexCenterWrapper, useTranslation } from '@arextest/arex-core';
import React, { FC } from 'react';

type EmptyResponseProps = {
  onClick?: () => void;
};

const EmptyResponse: FC<EmptyResponseProps> = (props) => {
  const { t } = useTranslation(['components']);

  return (
    <FlexCenterWrapper style={{ padding: '24px' }}>
      <Empty
        description={t('appSetting.emptyResponse')}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        style={{ paddingBottom: '16px' }}
      />

      <Button size='small' type='primary' onClick={() => props.onClick?.()}>
        {t('appSetting.configResponse')}
      </Button>
    </FlexCenterWrapper>
  );
};

export default EmptyResponse;
