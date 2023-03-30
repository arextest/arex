import { css } from '@emotion/react';
import { message } from 'antd';
import { useContext, useImperativeHandle, useRef } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useMonaco } from '../../../../hooks';
import { tryParseJsonString } from '../../../../utils';
import { HttpContext } from '../../index';

const HttpRawBody = ({ cRef }: any) => {
  const { store, dispatch } = useContext(HttpContext);
  const { t } = useTranslation();
  useImperativeHandle(cRef, () => {
    return {
      prettifyRequestBody: function () {
        prettifyRequestBody();
      },
    };
  });
  const prettifyRequestBody = () => {
    try {
      const jsonObj = tryParseJsonString(store.request.body.body as string);
      dispatch((state) => {
        state.request.body.body = JSON.stringify(jsonObj, null, 2);
      });
    } catch (e) {
      message.error(t('error.json_prettify_invalid_body'));
    }
  };
  const rawBodyParameters = useRef(null);
  useMonaco(rawBodyParameters, store.request.body.body, {
    extendedEditorConfig: {
      lineWrapping: true,
      mode: 'json',
      placeholder: t('request.raw_body').toString(),
      theme: store.theme,
    },
    environmentHighlights: true,
    onChange: (value: string) => {
      dispatch((state) => {
        state.request.body.body = value;
      });
    },
  });

  return (
    <div
      css={css`
        flex: 1;
        overflow-y: auto;
      `}
    >
      <div
        css={css`
          height: 100%;
        `}
        ref={rawBodyParameters}
      ></div>
    </div>
  );
};

export default HttpRawBody;
