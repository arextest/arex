import { CopyOutlined } from '@ant-design/icons';
import { Editor } from '@arextest/monaco-react';
import { css } from '@emotion/react';
import { message, Tooltip } from 'antd';
import copy from 'copy-to-clipboard';
import { FC, useContext } from 'react';
import React from 'react';

import { Context } from '../../../../../providers/RequestProvider';
import { ArexRESTResponse } from '../../../helpers/types/ArexRESTResponse';
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
  const { store } = useContext(Context);
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
          language={'json'}
          value={JSON.stringify(strToJson(jsonObj), null, 4)}
        />
      </div>
    </div>
  );
};

export default JSONLensRenderer;
