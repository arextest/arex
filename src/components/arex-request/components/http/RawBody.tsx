import { json } from '@codemirror/lang-json';
import { css } from '@emotion/react';
import { Button, message } from 'antd';
import {
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { useCodeMirror } from '../../helpers/editor/codemirror';
import { HttpContext } from '../../index';
const HttpRawBody = ({ cRef }: any) => {
  const rawBodyParameters = useRef(null);
  const { store, dispatch } = useContext(HttpContext);
  useCodeMirror({
    container: rawBodyParameters.current,
    value: store.request.body.body,
    height: '100%',
    extensions: [json()],
    theme: store.darkMode ? 'dark' : 'light',
    onChange: (val: string) => {
      dispatch({
        type: 'request.body.body',
        payload: val,
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
      const jsonObj = JSON.parse(store.request.body.body);
      dispatch({
        type: 'request.body.body',
        payload: JSON.stringify(jsonObj, null, 2),
      });
    } catch (e) {
      message.error('error');
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
