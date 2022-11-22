import { CodeOutlined } from '@ant-design/icons';
import { ReactNode } from 'react';

import ScriptSnippets from '../ScriptSnippets';
import PreRequestScript from './PreRequestScript';

export default PreRequestScript;

export enum ScriptBlockType {
  CustomScript = 'ScriptSnippets',
}

export type ScriptBlock<T> = {
  key: string;
  type: ScriptBlockType;
  icon: ReactNode;
  label: ReactNode;
  data: T;
  disabled: boolean;
};

export const ScriptBlocks = [
  {
    key: ScriptBlockType.CustomScript,
    label: 'CustomScript',
    icon: <CodeOutlined />,
    component: ScriptSnippets,
  },
];

// a little function to help us with reordering the result
export const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
