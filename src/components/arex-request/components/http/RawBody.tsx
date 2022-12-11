import { json } from '@codemirror/lang-json';
import { css, jsx } from '@emotion/react';
import { Button, message } from 'antd';
import {
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useCodeMirror } from '../../helpers/editor/codemirror';
import { HttpContext } from '../../index';
const HttpRawBody = ({ cRef }: any) => {
  const rawBodyParameters = useRef(null);
  const { store, dispatch } = useContext(HttpContext);
  const { t } = useTranslation();
  useCodeMirror({
    container: rawBodyParameters.current,
    value: store.request.body.body,
    height: '100%',
    extensions: [json()],
    theme: store.theme,
    onChange: (value: string) => {
      dispatch((state) => {
        state.request.body.body = value;
      });
    },
  });
  useImperativeHandle(cRef, () => {
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
        state.request.body.body = JSON.stringify(jsonObj, null, 2);
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
      <div ref={rawBodyParameters}></div>
    </div>
  );
};

export default HttpRawBody;
