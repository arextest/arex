import { Editor } from '@arextest/monaco-react';
import { css } from '@emotion/react';
import React, { FC, useContext } from 'react';

import { Context } from '../../../../../providers/ConfigProvider';
import { ArexRESTResponse } from '../../../helpers/types/ArexRESTResponse';
const RawLensRenderer: FC<{ response: ArexRESTResponse }> = ({ response }) => {
  const { store } = useContext(Context);
  return (
    <div
      css={css`
        height: 100%;
      `}
    >
      <Editor
        theme={store.theme === 'dark' ? 'vs-dark' : 'light'}
        options={{
          minimap: {
            enabled: false,
          },
          fontSize: 12,
          wordWrap: 'on',
          automaticLayout: true,
          fontFamily: 'IBMPlexMono, "Courier New", monospace',
          scrollBeyondLastLine: false,
          readOnly: true,
        }}
        value={response.type === 'success' ? response.body.toString() : ''}
      />
    </div>
  );
};

export default RawLensRenderer;
