import { json } from '@codemirror/lang-json';
import { css } from '@emotion/react';
import { message } from 'antd';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { tryPrettierJsonString } from '../../../../helpers/utils';
import { useCodeMirror } from '../../helpers/editor/codemirror';
import { HttpContext } from '../../index';

export type HttpRawBodyRef = {
  prettifyRequestBody: () => void;
};

const HttpRawBody = forwardRef<HttpRawBodyRef>((props, ref) => {
  const rawBodyParameters = useRef<HTMLDivElement>(null);
  const { store, dispatch } = useContext(HttpContext);
  const { t } = useTranslation();

  useImperativeHandle(ref, () => ({ prettifyRequestBody }));

  useCodeMirror({
    container: rawBodyParameters.current,
    value: store.request.body?.body,
    height: '100%',
    extensions: [json()],
    theme: store.theme,
    onChange: (value: string) => {
      dispatch((state) => {
        state.request.body.body = value;
      });
    },
  });

  const prettifyRequestBody = () => {
    dispatch((state) => {
      state.request.body.body = tryPrettierJsonString(
        store.request.body.body,
        t('error.json_prettify_invalid_body'),
      ) as string;
    });
  };

  return (
    <div
      css={css`
        flex: 1;
        overflow-y: auto;
      `}
    >
      <div ref={rawBodyParameters}></div>
    </div>
  );
});

export default HttpRawBody;
