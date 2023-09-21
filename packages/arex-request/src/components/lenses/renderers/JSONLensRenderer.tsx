import { CopyOutlined } from '@ant-design/icons';
import { copyToClipboard, css, Theme, useArexCoreConfig } from '@arextest/arex-core';
import { Editor } from '@arextest/monaco-react';
import { App, Tooltip, Typography } from 'antd';
import React, { FC } from 'react';

import { ArexRESTResponse } from '../../../types';
function strToJson(str: string) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return String(str);
  }
}
const JSONLensRenderer: FC<{ response?: ArexRESTResponse }> = ({ response }) => {
  const { message } = App.useApp();
  const { theme } = useArexCoreConfig();

  const jsonObj =
    response?.type === 'success' || response?.type === 'fail' ? response?.body : undefined;

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        height: 100%;
      `}
    >
      <div
        css={css`
          margin-top: 8px;
          display: flex;
          justify-content: space-between;
        `}
      >
        <Typography.Text type='secondary'>Response Body</Typography.Text>
        <div>
          <div>
            <Tooltip title='Copy' placement='left'>
              <a
                css={css`
                  padding-bottom: 8px;
                  display: block;
                `}
                onClick={() => {
                  copyToClipboard(JSON.stringify(strToJson(jsonObj), null, 4));
                  message.success('copy success');
                }}
              >
                <CopyOutlined />
              </a>
            </Tooltip>
          </div>
        </div>
      </div>
      <div
        css={css`
          flex: 1;
          overflow-y: auto;
        `}
      >
        <Editor
          language='json'
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
          value={JSON.stringify(strToJson(jsonObj), null, 4)}
        />
      </div>
    </div>
  );
};

export default JSONLensRenderer;
