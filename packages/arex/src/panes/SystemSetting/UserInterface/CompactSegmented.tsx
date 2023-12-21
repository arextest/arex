import { Segmented } from '@arextest/arex-core';
import { Tooltip } from 'antd';
import React, { FC } from 'react';

import { Icon } from '@/components';

const CompactSegmented: FC = (props) => {
  return (
    <Segmented
      options={[
        {
          label: (
            <Tooltip title={'ZoomOut'}>
              <Icon name='ZoomOut' />
            </Tooltip>
          ),
          // @ts-ignore
          value: true,
        },
        {
          label: (
            <Tooltip title={'ZoomIn'}>
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
