import { CopyOutlined } from '@ant-design/icons';
import {
  copyToClipboard,
  css,
  Segmented,
  SpaceBetweenWrapper,
  Theme,
  tryPrettierJsonString,
  useArexCoreConfig,
} from '@arextest/arex-core';
import { Editor } from '@arextest/monaco-react';
import { App, Tooltip } from 'antd';
import React, { FC, useMemo, useState } from 'react';

import { ArexRESTResponse } from '../../../types';

enum DisplayMode {
  'Pretty' = 'Pretty',
  'Raw' = 'Raw',
  'Preview' = 'Preview',
}

const ResponseBody: FC<{ response?: ArexRESTResponse }> = ({ response }) => {
  const { message } = App.useApp();
  const { theme } = useArexCoreConfig();

  const [displayMode, setDisplayMode] = useState(DisplayMode.Pretty);

  const bodyValue = useMemo(() => {
    if (response?.type === 'success' || response?.type === 'fail') {
      return displayMode === DisplayMode.Pretty
        ? tryPrettierJsonString(response?.body)
        : response?.body;
    }
  }, [response, displayMode]);

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        height: 100%;
      `}
    >
      <SpaceBetweenWrapper style={{ margin: '4px' }}>
        <Segmented
          size='small'
          value={displayMode}
          options={['Pretty', 'Raw', 'Preview']}
          onChange={(value: string) => setDisplayMode(value as DisplayMode)}
        />
        <Tooltip title='Copy' placement='left'>
          <a
            css={css`
              padding-bottom: 8px;
              display: block;
            `}
            onClick={() => {
              copyToClipboard(bodyVaglue || '');
              message.success('copy success');
            }}
          >
            <CopyOutlined />
          </a>
        </Tooltip>
      </SpaceBetweenWrapper>

      <div
        css={css`
          flex: 1;
          overflow-y: auto;
        `}
      >
        <Editor
          language={displayMode === DisplayMode.Pretty ? 'json' : 'text'}
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
          value={bodyValue}
        />
      </div>
    </div>
  );
};

export default ResponseBody;
