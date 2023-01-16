import { CodeOutlined } from '@ant-design/icons';
import React, { FC, ReactNode } from 'react';

import ScriptSnippets from '../ScriptSnippets';
import ExtraScriptBlocks from './ExtraScriptBlocks';
import ScriptBlocks from './ScriptBlocks';

export default ScriptBlocks;

export const ScriptBlockType = {
  CustomScript: 'ScriptSnippets',
} as const;

export type BaseScriptBlock = {
  key: string;
  type: (typeof ScriptBlockType)[keyof typeof ScriptBlockType];
  icon: ReactNode;
  label: ReactNode;
};

export type ScriptBlock<T> = BaseScriptBlock & {
  value: T;
  disabled: boolean;
};

export type ScriptBlocksFC<T, P extends object = any> = FC<
  {
    disabled?: boolean;
    height?: string;
    value?: T;
    onChange?: (value: T) => void;
  } & P
>;

export type ScriptBlocksType<T> = BaseScriptBlock & {
  component: ScriptBlocksFC<T>;
};

export const ScriptBlocksList: ScriptBlocksType<any>[] = [
  {
    key: ScriptBlockType.CustomScript,
    type: ScriptBlockType.CustomScript,
    label: 'CustomScript',
    icon: <CodeOutlined />,
    component: ScriptSnippets,
  },
  ...ExtraScriptBlocks,
];

export const ScriptBlocksMap = ScriptBlocksList.reduce<{ [type: string]: ScriptBlocksType<any> }>(
  (map, block) => {
    map[block.key] = block;
    return map;
  },
  {},
);

// a little function to help us with reordering the result
export const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
