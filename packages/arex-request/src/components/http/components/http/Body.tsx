import { css, useTheme } from '@emotion/react';
import { Radio, Select } from 'antd';
import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Context } from '../../../../providers/ConfigProvider';
import BinaryBody from './BinaryBody';
import RawBody from './RawBody';
const genContentType = (contentType: string | null) => {
  if (contentType?.includes('application/json')) {
    return 'raw';
  } else {
    return 'binary';
  }
};
const HttpBody = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { store, dispatch } = useContext(Context);

  const bigCateOptions = ['raw', 'binary'];

  const rawSmallCateOptions = [
    {
      label: 'JSON',
      value: 'application/json',
      test: (
        <span
          css={css`
            color: ${theme.colorPrimary};
          `}
        >
          JSON
        </span>
      ),
    },
  ];

  const onChange = (value: any) => {
    dispatch((state) => {
      state.request.body.contentType = value;
    });
  };
  const rawBodyRef = useRef<any>(null);
  const isShow = useMemo(() => {
    // @ts-ignore
    return ['application/json'].includes(store.request.body.contentType);
  }, [store.request.body.contentType]);
  useEffect(() => {
    if (
      store.request.body.contentType?.includes('application/json') &&
      store.request.body.contentType !== 'application/json'
    ) {
      dispatch((state) => {
        state.request.body.contentType = 'application/json';
      });
    }
  }, [store.request.body.contentType]);
  return (
    <div
      css={css`
        height: 100%;
        display: flex;
        flex-direction: column;
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          margin: 6px 0;
          padding-bottom: 6px;
        `}
      >
        <div>
          <Radio.Group
            options={bigCateOptions}
            value={genContentType(store.request.body.contentType)}
            onChange={(val) => {
              if (val.target.value === 'binary') {
                dispatch((state) => {
                  // @ts-ignore
                  state.request.body.contentType = '0';
                  // state.request.body.body = '';
                });
              }
              if (val.target.value === 'raw') {
                dispatch((state) => {
                  state.request.body.contentType = 'application/json';
                  // state.request.body.body = '';
                });
              }
            }}
          />

          <Select
            css={css`
              display: ${isShow ? 'inline-block' : 'none'};
            `}
            value={store.request.body.contentType}
            bordered={false}
            size={'small'}
            options={rawSmallCateOptions}
            optionLabelProp={'test'}
            onChange={onChange}
          />
        </div>
        <a
          css={css`
            display: ${isShow ? 'block' : 'none'};
          `}
          onClick={() => {
            rawBodyRef.current.prettifyRequestBody();
          }}
        >
          {t('action.prettify')}
        </a>
      </div>
      {isShow && <RawBody ref={rawBodyRef} />}
      {!isShow && <BinaryBody />}
    </div>
  );
};

export default HttpBody;
