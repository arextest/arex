import { css, Theme, useArexCoreConfig } from '@arextest/arex-core';
import { Editor } from '@arextest/monaco-react';
import React, { FC } from 'react';

import { ArexRESTResponse } from '../../../types/ArexRESTResponse';

const RawLensRenderer: FC<{ response: ArexRESTResponse }> = ({ response }) => {
  const { theme } = useArexCoreConfig();
  return (
    <div
      css={css`
        height: 100%;
      `}
    >
      <Editor
        theme={theme === Theme.dark ? 'vs-dark' : 'light'}
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
