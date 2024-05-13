import { Segmented } from '@arextest/arex-core';
import { Tooltip } from 'antd';
import React, { FC } from 'react';

import { Icon } from '@/components';
import { Theme } from '@/constant';

const ThemeSegmented: FC = (props) => {
  return (
    <Segmented
      options={[
        {
          label: (
            <Tooltip title={'Light'}>
              <Icon name='Sun' />
            </Tooltip>
          ),
          value: Theme.light,
        },
        {
          label: (
            <Tooltip title={'Dark'}>
              <Icon name='MoonStar' />
            </Tooltip>
          ),
          value: Theme.dark,
        },
        {
          label: (
            <Tooltip title={'System'}>
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
