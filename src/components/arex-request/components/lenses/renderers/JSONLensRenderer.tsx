// @ts-nocheck
import { CopyOutlined } from '@ant-design/icons';
import { json } from '@codemirror/lang-json';
import { EditorView } from '@codemirror/view';
import { css } from '@emotion/react';
import { Button, message, Space, Tooltip } from 'antd';
// import copy from 'copy-to-clipboard';
import { FC, useContext, useRef } from 'react';

import { useCodeMirror } from '../../../helpers/editor/codemirror';
import { HoppRESTResponse } from '../../../helpers/types/HoppRESTResponse';
import { GlobalContext, HttpContext } from '../../../index';
function coppyUrl(url) {
  // copy(url);
  message.success('copy success🎉');
}
const JSONLensRenderer: FC<{ response: HoppRESTResponse }> = ({ response }) => {
  const { store } = useContext(HttpContext);
  const { store: globalStore } = useContext(GlobalContext);
  const jsonResponse = useRef(null);
  const jsonObj = JSON.parse(response.body || '{}');
  useCodeMirror({
    container: jsonResponse.current,
    value: JSON.stringify(jsonObj, null, 2),
    height: '100%',
    extensions: [json(), EditorView.lineWrapping],
    theme: globalStore.theme.type,
  });
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
                  padding: 8px;
                  display: block;
                `}
                onClick={() => coppyUrl(JSON.stringify(jsonObj, null, 2))}
              >
                <CopyOutlined />
              </a>
            </Tooltip>
          </div>
          {/*<Space>你好</Space>*/}
        </div>
      </div>
      <div
        css={css`
          overflow-y: auto;
        `}
      >
        <div ref={jsonResponse}></div>
      </div>
    </div>
  );
};

export default JSONLensRenderer;
