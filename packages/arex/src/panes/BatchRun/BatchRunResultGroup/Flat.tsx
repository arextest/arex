import * as React from 'react';
import { ReactElement } from 'react';

type Props = {
  blockMap: Map<string, ReactElement>;
};

export function Flat(props: Props) {
  const { blockMap } = props;
  return (
    <>
      <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
        {...Array.from(blockMap.values())}
      </div>
    </>
  );
}
