import { css, Theme, useArexCoreConfig } from '@arextest/arex-core';
import { Editor } from '@arextest/monaco-react';
import { message } from 'antd';
import { forwardRef, useImperativeHandle } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useArexRequestProps, useArexRequestStore } from '../../hooks';

const HttpRawBody = (props: any, ref: any) => {
  const { theme } = useArexCoreConfig();
  const { store, dispatch } = useArexRequestStore();
  const { t } = useTranslation();
  useImperativeHandle(ref, () => {
    return {
      prettifyRequestBody: function () {
        prettifyRequestBody();
      },
    };
  });
  const prettifyRequestBody = () => {
    try {
      const jsonObj = JSON.parse(store.request.body.body as string);
      dispatch((state) => {
        state.request.body.body = JSON.stringify(jsonObj, null, 4);
      });
    } catch (e) {
      message.error(t('error.json_prettify_invalid_body'));
    }
  };
  return (
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
        }}
        language={'json'}
        value={store.request.body.body as string}
        onChange={(value) => {
          dispatch((state) => {
            if (value !== undefined) {
              state.request.body.body = value;
            }
          });
        }}
      />
    </div>
  );
};

export default forwardRef(HttpRawBody);
