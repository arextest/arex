import { json } from '@codemirror/lang-json';
import { css } from '@emotion/react';
import { Button, message } from 'antd';
import { useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { useCodeMirror } from '../../helpers/editor/codemirror';
import { HttpContext } from '../../index';
const HttpRawBody = ({ data, cRef, theme }) => {
  const rawBodyParameters = useRef(null);
  const { store, dispatch } = useContext(HttpContext);

  useCodeMirror({
    container: rawBodyParameters.current,
    value: store.request.body.body,
    height: '100%',
    extensions: [json()],
    theme: theme,
    onChange: (val) => {
      dispatch({
        type: 'request.body.body',
        payload: val,
      });
    },
  });

  //用useImperativeHandle暴露一些外部ref能访问的属性
  useImperativeHandle(cRef, () => {
    // 需要将暴露的接口返回出去
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
      message.error(e.message);
    }
  };

  const handleName = (e) => {};

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
