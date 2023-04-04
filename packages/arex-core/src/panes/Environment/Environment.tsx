import React from 'react';

import { PanesFC } from '../index';

export type EnvironmentPanesData = {
  envName: string;
  id: string;
  keyValues?: EnvironmentKeyValues[];
  workspaceId?: string;
};

export type EnvironmentKeyValues = { key: string; value: string; active?: boolean };

const Environment: PanesFC<EnvironmentPanesData> = () => {
  return <div>Environment</div>;
};

export default Environment;
