import { css } from '@arextest/arex-core';
import { Radio, RadioChangeEvent, Select } from 'antd';
import React, { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useArexRequestStore } from '../../hooks';
import { ArexContentTypes } from '../../types';
import BinaryBody from './BinaryBody';
import RawBody, { HttpRawBodyRef } from './RawBody';

const genContentType = (contentType?: string) =>
  contentType?.includes('application/json') ? 'raw' : 'binary';

const bigCateOptions = ['raw', 'binary'];

const rawSmallCateOptions = [
  {
    label: 'JSON',
    value: 'application/json',
    test: <a>JSON</a>,
  },
];

const HttpBody = () => {
  const { t } = useTranslation();
  const { store, dispatch } = useArexRequestStore();

  const rawBodyRef = useRef<HttpRawBodyRef>(null);

  const isJsonContentType = useMemo(() => {
    return ['application/json'].includes(store.request.body.contentType || '');
  }, [store.request.body.contentType]);

  const onChange = (value: ArexContentTypes) => {
    dispatch((state) => {
      state.request.body.contentType = value;
    });
  };

  const handleContentTypeChange = (val: RadioChangeEvent) => {
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
  };

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
            onChange={handleContentTypeChange}
          />

          {isJsonContentType && (
            <Select
              value={store.request.body.contentType}
              bordered={false}
              size={'small'}
              options={rawSmallCateOptions}
              optionLabelProp={'test'}
              onChange={onChange}
            />
          )}
        </div>

        {isJsonContentType && (
          <a onClick={rawBodyRef?.current?.prettifyRequestBody}>{t('action.prettify')}</a>
        )}
      </div>

      {isJsonContentType ? <RawBody ref={rawBodyRef} /> : <BinaryBody />}
    </div>
  );
};

export default HttpBody;
