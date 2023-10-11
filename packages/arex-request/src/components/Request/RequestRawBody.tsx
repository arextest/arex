import { css, Theme, tryPrettierJsonString, useArexCoreConfig } from '@arextest/arex-core';
import { Editor } from '@arextest/monaco-react';
import { App } from 'antd';
import React, { forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';

import { useArexRequestStore } from '../../hooks';

export type RequestRawBodyRef = {
  prettifyRequestBody: () => void;
};

const RequestRawBody = forwardRef<RequestRawBodyRef>((props, ref) => {
  const { theme } = useArexCoreConfig();
  const { store, dispatch } = useArexRequestStore();

  const { message } = App.useApp();
  const { t } = useTranslation();

  const prettifyRequestBody = () => {
    try {
      dispatch((state) => {
        state.request.body.body = tryPrettierJsonString(store?.request?.body?.body as string);
      });
    } catch (e) {
      message.error(t('error.json_prettify_invalid_body'));
    }
  };

  useImperativeHandle(ref, () => {
    return {
      prettifyRequestBody,
    };
  });

  return (
    <div
      css={css`
        height: 100%;
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
});

export default RequestRawBody;
