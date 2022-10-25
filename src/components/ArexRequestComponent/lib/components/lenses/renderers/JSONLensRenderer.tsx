import { CopyOutlined } from '@ant-design/icons';
import { json } from '@codemirror/lang-json';
import { css } from '@emotion/react';
import { Button, Space, Tooltip } from 'antd';
import { FC, useContext, useRef } from 'react';

import { useCodeMirror } from '../../../helpers/editor/codemirror';
import { HoppRESTResponse } from '../../../helpers/types/HoppRESTResponse';
import { HttpContext } from '../../../index';

const JSONLensRenderer: FC<{ response: HoppRESTResponse }> = ({ response }) => {
  const { store } = useContext(HttpContext);
  const jsonResponse = useRef(null);
  const jsonObj = JSON.parse(response.body || '{}');
  useCodeMirror({
    container: jsonResponse.current,
    value: JSON.stringify(jsonObj, null, 2),
    height: '100%',
    extensions: [json()],
    theme: store.theme,
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
