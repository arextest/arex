import { CopyOutlined } from '@ant-design/icons';
import { css, Theme, useArexCoreConfig } from '@arextest/arex-core';
import { Editor } from '@arextest/monaco-react';
import { message, Tooltip } from 'antd';
import copy from 'copy-to-clipboard';
import React, { FC } from 'react';

import { ArexRESTResponse } from '../../../types/ArexRESTResponse';
function coppyUrl(text: string) {
  copy(text);
  message.success('copy success');
}
function strToJson(str: string) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return String(str);
  }
}
const JSONLensRenderer: FC<{ response: ArexRESTResponse }> = ({ response }) => {
  const { theme } = useArexCoreConfig();
  // @ts-ignore
  const jsonObj = response.body;
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
          display: flex;
          justify-content: space-between;
        `}
      >
        <span>Response Body</span>
        <div>
          <div>
            <Tooltip title={'Copy'} placement={'left'}>
              <a
                css={css`
                  padding-bottom: 8px;
                  display: block;
                `}
                // @ts-ignore
                onClick={() => coppyUrl(JSON.stringify(strToJson(jsonObj), null, 4))}
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
          language={'json'}
          value={JSON.stringify(strToJson(jsonObj), null, 4)}
        />
      </div>
    </div>
  );
};

export default JSONLensRenderer;
