import React from 'react';

import { PanesType } from '../../constant';
import { ArexPaneFC, createPane } from '../index';

export type EnvironmentPanesData = {
  value: string;
};

export type EnvironmentKeyValues = { key: string; value: string; active?: boolean };

const Environment: ArexPaneFC<EnvironmentPanesData> = (props) => {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <span>props.value: {props.data.value}</span>
      <span>count: {count}</span>
      <button onClick={() => setCount((count) => count + 1)}>add</button>
    </div>
  );
};

export default createPane(Environment, PanesType.ENVIRONMENT);
