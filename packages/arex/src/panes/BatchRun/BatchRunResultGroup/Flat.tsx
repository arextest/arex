import * as React from 'react';

import { GroupProps } from '@/panes/BatchRun/BatchRunResultGroup/common';

export function Flat(props: GroupProps) {
  const { blockMap } = props;
  return (
    <>
      <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
        {...Array.from(blockMap.values())}
      </div>
    </>
  );
}
