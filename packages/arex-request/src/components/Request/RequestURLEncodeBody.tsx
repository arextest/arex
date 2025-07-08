import { CopyOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { copyToClipboard, SpaceBetweenWrapper, TooltipButton } from '@arextest/arex-core';
import { App, Typography } from 'antd';
import pagination from 'antd/es/pagination';
import PM from 'postman-collection';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useArexRequestStore } from '../../hooks';
import { ArexRESTParam } from '../../types';
import HeadersTable from '../HeadersTable';

const RequestURLEncodeBody: FC = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const { store, dispatch } = useArexRequestStore();
  const { params } = store.request;
  const body = store.request?.body?.body as string;

  const setParams = (params: ArexRESTParam[]) => {
    dispatch((state) => {
      state.request.params = params;
      // 同时更新body为URI编码格式
      const urlEncoded = params
        .filter((p) => p.active && p.key)
        .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value || '')}`)
        .join('&');
      if (state.request.body) {
        state.request.body.body = urlEncoded;
      }
    });
  };

  // 初始化时从body解析参数
  useEffect(() => {
    if (body && params.length === 0) {
      try {
        const urlParams = new URLSearchParams(body);
        const parsedParams: ArexRESTParam[] = [];
        urlParams.forEach((value, key) => {
          parsedParams.push({
            key: decodeURIComponent(key),
            value: decodeURIComponent(value),
            active: true,
            id: String(Math.random()),
          });
        });
        if (parsedParams.length > 0) {
          dispatch((state) => {
            state.request.params = parsedParams;
          });
        }
      } catch (e) {
        console.warn('Failed to parse URL encoded body:', e);
      }
    }
  }, [body, dispatch]);

  const handleCopyParameters = () => {
    const urlEncoded = params
      .filter((p) => p.active)
      .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
      .join('&');
    copyToClipboard(urlEncoded);
    message.success(t('action.copy_success'));
  };

  return (
    <div>
      <SpaceBetweenWrapper>
        <Typography.Text type='secondary'>{t('request.urlencoded_body')}</Typography.Text>
        <div>
          <TooltipButton
            title={t('action.copy')}
            icon={<CopyOutlined />}
            onClick={handleCopyParameters}
          />

          <TooltipButton
            title={t('action.clear_all')}
            icon={<DeleteOutlined />}
            onClick={() => {
              setParams([]);
            }}
          />

          <TooltipButton
            title={t('add.new')}
            icon={<PlusOutlined />}
            onClick={() => {
              setParams(
                params.concat([{ value: '', key: '', id: String(Math.random()), active: true }]),
              );
            }}
          />
        </div>
      </SpaceBetweenWrapper>

      <HeadersTable
        editable
        rowKey='id'
        pagination={false}
        dataSource={params}
        // @ts-ignore
        onEdit={setParams}
      />
    </div>
  );
};

export default RequestURLEncodeBody;
