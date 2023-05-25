import { css } from '@emotion/react';
import { FC, useRef } from 'react';

import { Options, useMonaco } from './monaco';

const MonacoEditor: FC<{ value: string; option: Options }> = ({ value, option }) => {
  const ref = useRef(null);
  useMonaco(ref, value, option);
  return (
    <div
      css={css`
        height: 100%;
      `}
      ref={ref}
    ></div>
  );
};

export default MonacoEditor;
