import { CopyOutlined } from '@ant-design/icons';
import { json } from '@codemirror/lang-json';
import { EditorView } from '@codemirror/view';
import { css } from '@emotion/react';
import { App, Tooltip } from 'antd';
import copy from 'copy-to-clipboard';
import React, { FC, useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useCodeMirror } from '../../../helpers/editor/codemirror';
import { HoppRESTResponse } from '../../../helpers/types/HoppRESTResponse';
import { HttpContext } from '../../../index';

const JSONLensRenderer: FC<{ response: HoppRESTResponse | null }> = ({ response }) => {
  const { t } = useTranslation();
  const { message } = App.useApp();

  const jsonResponse = useRef(null);
  const jsonObj = response?.type === 'success' ? response?.body : '';
  const { store } = useContext(HttpContext);
  useCodeMirror({
    container: jsonResponse.current,
    value: JSON.stringify(jsonObj, null, 2),
    height: '100%',
    extensions: [json(), EditorView.lineWrapping],
    theme: store.theme,
  });

  function copyUrl(text: string) {
    copy(text);
    message.success('copy success🎉');
  }
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
        <span>{t('http.responseBody', { ns: 'components' })}</span>
        <div>
          <div>
            <Tooltip title={'Copy'} placement={'left'}>
              <a
                css={css`
                  padding-bottom: 8px;
                  display: block;
                `}
                onClick={() => copyUrl(JSON.stringify(jsonObj, null, 2))}
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
