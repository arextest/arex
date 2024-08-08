import { Segmented, useTranslation } from '@arextest/arex-core';
import { Tooltip } from 'antd';
import React, { FC } from 'react';

import { Icon } from '@/components';
import { Theme } from '@/constant';

const ThemeSegmented: FC = (props) => {
  const { t } = useTranslation();
  return (
    <Segmented
      options={[
        {
          label: (
            <Tooltip title={t('components:systemSetting.theme.light')}>
              <Icon name='Sun' />
            </Tooltip>
          ),
          value: Theme.light,
        },
        {
          label: (
            <Tooltip title={t('components:systemSetting.theme.dark')}>
              <Icon name='MoonStar' />
            </Tooltip>
          ),
          value: Theme.dark,
        },
        {
          label: (
            <Tooltip title={t('components:systemSetting.theme.system')}>
              <Icon name='Laptop' />
            </Tooltip>
          ),
          value: Theme.system,
        },
      ]}
      {...props}
    />
  );
};

export default ThemeSegmented;
