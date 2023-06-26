import { css } from '@emotion/react';
import { Segmented as SegmentedAntd, SegmentedProps } from 'antd';
import { Theme } from '@arextest/arex-core';
import React, { forwardRef } from 'react';

import { useUserProfile } from '@/store';

const Segmented = forwardRef<HTMLDivElement, Omit<SegmentedProps, 'ref'>>((props, ref) => {
  const { theme } = useUserProfile();

  return (
    <SegmentedAntd
      {...props}
      css={css`
        background-color: ${theme === Theme.dark ? '#141414' : '#f5f5f5'};
      `}
    />
  );
});

export default Segmented;
