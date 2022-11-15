import { ReactNode } from 'react';

import CustomScript from './CustomScript';

export enum ScriptBlockType {
  CustomScript = 'CustomScript',
}

export type ScriptBlock<T> = {
  id: string;
  type: ScriptBlockType;
  icon: ReactNode;
  title: ReactNode;
  data: T;
  disabled: boolean;
};

export default {
  CustomScript,
};
