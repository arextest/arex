import { ReactElement } from 'react';

import { RunResult } from '@/panes/BatchRun/BatchRun';

export type GroupProps = {
  blockMap: Map<RunResult, ReactElement>;
  selectedKey?: string;
};
