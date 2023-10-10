import { css } from '@emotion/react';
import { Segmented as SegmentedAntd, SegmentedProps } from 'antd';
import React, { forwardRef } from 'react';

import { useArexCoreConfig } from '../hooks';
import { Theme } from '../theme';

const Segmented = forwardRef<HTMLDivElement, Omit<SegmentedProps, 'ref'>>((props, ref) => {
  const { theme } = useArexCoreConfig();

  return (
    <SegmentedAntd
      {...props}
      css={css`
        height: fit-content;
        background-color: ${theme === Theme.dark ? '#141414' : '#f5f5f5'};
      `}
    />
  );
});

export default Segmented;
