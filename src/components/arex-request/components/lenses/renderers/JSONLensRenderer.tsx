import { CopyOutlined } from '@ant-design/icons';
import { json } from '@codemirror/lang-json';
import { EditorView } from '@codemirror/view';
import { css } from '@emotion/react';
import { Button, message, Space, Tooltip } from 'antd';
import { FC, useContext, useRef } from 'react';
import useDarkMode from 'use-dark-style';

import { useCodeMirror } from '../../../helpers/editor/codemirror';
import { HoppRESTResponse } from '../../../helpers/types/HoppRESTResponse';
import { GlobalContext, HttpContext } from '../../../index';
function coppyUrl(url) {
  message.success('copy success🎉');
}
const JSONLensRenderer: FC<{ response: HoppRESTResponse }> = ({ response }) => {
  const jsonResponse = useRef(null);
  const jsonObj = JSON.parse(response.body || '{}');
  const darkMode = useDarkMode();
  useCodeMirror({
    container: jsonResponse.current,
    value: JSON.stringify(jsonObj, null, 2),
    height: '100%',
    extensions: [json(), EditorView.lineWrapping],
    theme: darkMode.value ? 'dark' : 'light',
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
