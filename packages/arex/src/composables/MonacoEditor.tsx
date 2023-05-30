import React, { FC, useRef } from 'react';

import { Options, useMonaco } from './monaco';

const MonacoEditor: FC<{ value: string; option: Options }> = ({ value, option }) => {
  const ref = useRef(null);
  useMonaco(ref, value, option);

  return <div style={{ height: option.height || '360px' }} ref={ref} />;
};

export default MonacoEditor;
