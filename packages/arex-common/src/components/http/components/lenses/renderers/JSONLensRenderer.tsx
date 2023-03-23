import { CopyOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { message, Tooltip } from 'antd';
import copy from 'copy-to-clipboard';
import { FC, useContext, useRef } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useMonaco } from '../../../../../composables/monaco';
import { HoppRESTResponse } from '../../../helpers/types/HoppRESTResponse';
import { HttpContext } from '../../../index';
function coppyUrl(text: string) {
  copy(text);
  message.success('copy success🎉');
}
const JSONLensRenderer: FC<{ response: HoppRESTResponse }> = ({ response }) => {
  // @ts-ignore
  const jsonObj = response.body;
  const { store, dispatch } = useContext(HttpContext);
  const jsonResponse = useRef(null);
  const { t } = useTranslation();
  useMonaco(jsonResponse, JSON.stringify(jsonObj, null, 2), {
    extendedEditorConfig: {
      lineWrapping: true,
      mode: 'json',
      placeholder: t('request.raw_body').toString(),
      readOnly: true,
      theme: store.theme,
    },
    environmentHighlights: true,
    onChange: (value: string) => {
      console.log();
    },
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
                  padding-bottom: 8px;
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
          height: 100%;
        `}
      >
        <div
          css={css`
            height: 100%;
          `}
          ref={jsonResponse}
        ></div>
      </div>
    </div>
  );
};

export default JSONLensRenderer;
