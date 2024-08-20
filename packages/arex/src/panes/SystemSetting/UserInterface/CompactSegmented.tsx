import { Segmented, useTranslation } from '@arextest/arex-core';
import { Tooltip } from 'antd';
import React, { FC } from 'react';

import { Icon } from '@/components';

const CompactSegmented: FC = (props) => {
  const { t } = useTranslation();
  return (
    <Segmented
      options={[
        {
          label: (
            <Tooltip title={t('components:systemSetting.zoomOut')}>
              <Icon name='ZoomOut' />
            </Tooltip>
          ),
          // @ts-ignore
          value: true,
        },
        {
          label: (
            <Tooltip title={t('components:systemSetting.zoomIn')}>
              <Icon name='ZoomIn' />
            </Tooltip>
          ),
          // @ts-ignore
          value: false,
        },
      ]}
      {...props}
    />
  );
};

export default CompactSegmented;
