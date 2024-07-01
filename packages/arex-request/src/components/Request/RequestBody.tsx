import { ReloadOutlined } from '@ant-design/icons';
import { css } from '@arextest/arex-core';
import { Button, Popover, Select, Typography } from 'antd';
import React, { useEffect, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { useArexRequestStore } from '../../hooks';
import { ArexContentTypes } from '../../types';
import RequestBinaryBody from './RequestBinaryBody';
import RequestBodyFormData from './RequestBodyFormData';
import RequestRawBody, { RequestRawBodyRef } from './RequestRawBody';

const rawSmallCateOptions = [
  {
    label: 'application/json',
    value: 'application/json',
  },
  {
    label: 'multipart/form-data',
    value: 'multipart/form-data',
  },
  {
    label: 'application/octet-stream',
    value: 'application/octet-stream',
  },
];

const RequestBody = () => {
  const { t } = useTranslation();
  const { store, dispatch } = useArexRequestStore();

  const rawBodyRef = useRef<RequestRawBodyRef>(null);

  const handleContentTypeChange = (value: ArexContentTypes) => {
    dispatch((state) => {
      state.request.body.contentType = value;
    });
  };

  const handleOverrideContentType = () => {
    dispatch((state) => {
      const index = state.request.headers.findIndex((header) => header.key === 'content-type');
      if (index >= 0) state.request.headers[index].value = store.request.body.contentType;
      else
        state.request.headers.push({
          key: 'content-type',
          value: store.request.body.contentType,
          active: true,
        });
    });
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
          <Typography.Text strong type='secondary'>
            Content Type
          </Typography.Text>
          <Select
            size='small'
            variant='borderless'
            popupMatchSelectWidth={false}
            value={store.request.body.contentType}
            options={rawSmallCateOptions}
            onChange={handleContentTypeChange}
            style={{ width: 'auto' }}
          />

          <Popover
            title={
              <Trans
                i18nKey='components:http.setContentTypeInHeaders'
                components={[
                  <Typography.Text key={0} code>
                    Content-Type
                  </Typography.Text>,
                ]}
              ></Trans>
            }
          >
            <Button
              size='small'
              icon={<ReloadOutlined />}
              onClick={handleOverrideContentType}
              style={{ marginLeft: '8px' }}
            >
              {t('components:http.override')}
            </Button>
          </Popover>
        </div>

        {store.request.body.contentType.startsWith('application/json') && (
          <a onClick={() => rawBodyRef?.current?.prettifyRequestBody()}>{t('action.prettify')}</a>
        )}
      </div>

      {store.request.body.contentType.startsWith('application/json') ? (
        <RequestRawBody ref={rawBodyRef} />
      ) : store.request.body.contentType.startsWith('multipart/form-data') ? (
        <RequestBodyFormData />
      ) : store.request.body.contentType.startsWith('application/octet-stream') ? (
        <RequestBinaryBody />
      ) : null}
    </div>
  );
};

export default RequestBody;
