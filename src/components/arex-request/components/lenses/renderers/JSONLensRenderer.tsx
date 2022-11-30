import { CopyOutlined } from '@ant-design/icons';
import { json } from '@codemirror/lang-json';
import { EditorView } from '@codemirror/view';
import { css } from '@emotion/react';
import { Button, message, Space, Tooltip } from 'antd';
import { FC, useContext, useRef } from 'react';

import { useCodeMirror } from '../../../helpers/editor/codemirror';
import { HoppRESTResponse } from '../../../helpers/types/HoppRESTResponse';
import { HttpContext } from '../../../index';
function coppyUrl() {
  message.success('copy success🎉');
}
const JSONLensRenderer: FC<{ response: HoppRESTResponse }> = ({ response }) => {
  const jsonResponse = useRef(null);
  // @ts-ignore
  const jsonObj = JSON.parse(response.body || '{}');
  const { store } = useContext(HttpContext);
  useCodeMirror({
    container: jsonResponse.current,
    // @ts-ignore
    value: JSON.stringify(jsonObj, null, 2),
    height: '100%',
    extensions: [json(), EditorView.lineWrapping],
    theme: store.darkMode ? 'dark' : 'light',
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
                // @ts-ignore
                onClick={() => coppyUrl(JSON.stringify(jsonObj, null, 2))}
              >
                <CopyOutlined />
              </a>
            </Tooltip>
          </div>
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
