import { json } from '@codemirror/lang-json';
import { css } from '@emotion/react';
import { Button, message } from 'antd';
import { useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCodeMirror } from '../../helpers/editor/codemirror';
import { useHttpRequestStore } from '../../store/useHttpRequestStore';
import { useHttpStore } from '../../store/useHttpStore';
const HttpRawBody = ({ cRef }: any) => {
  const { theme, response } = useHttpStore();
  const { body, setHttpRequestStore } = useHttpRequestStore();
  const rawBodyParameters = useRef(null);
  const { t } = useTranslation();
  useCodeMirror({
    container: rawBodyParameters.current,
    value: body.body,
    height: '100%',
    extensions: [json()],
    theme: theme,
    onChange: (val: string) => {
      setHttpRequestStore((state) => {
        state.body.body = val;
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
      console.log()
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
