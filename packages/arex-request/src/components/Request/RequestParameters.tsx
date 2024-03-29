import { CopyOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { copyToClipboard, SpaceBetweenWrapper, TooltipButton } from '@arextest/arex-core';
import { App, Typography } from 'antd';
import PM from 'postman-collection';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useArexRequestStore } from '../../hooks';
import { ArexRESTParam } from '../../types';
import HeadersTable from '../HeadersTable';

const RequestParameters: FC = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const { store, dispatch } = useArexRequestStore();
  const { endpoint, params } = store.request;

  const setParams = (params: ArexRESTParam[]) => {
    dispatch((state) => {
      state.request.params = params;
    });
  };

  // TODO: Optimize dependency change
  useEffect(() => {
    dispatch((state) => {
      const query = PM.Url.parse(state.request.endpoint).query || [];
      if (
        JSON.stringify(query) !== JSON.stringify(params.map(({ key, value }) => ({ key, value })))
      ) {
        if (typeof query !== 'string') {
          // @ts-ignore
          state.request.params = query.map(({ id, key, value }, index) => ({
            key,
            value: value || '',
            active: true,
            id: id || String(Math.random()),
          }));
        }
      }
    });
  }, [endpoint]);

  useEffect(() => {
    dispatch((state) => {
      state.request.endpoint = new PM.Url({
        ...PM.Url.parse(endpoint),
        query: state.request.params,
      }).toString();
    });
  }, [params]);

  const handleCopyParameters = () => {
    copyToClipboard(JSON.stringify(params.map((i) => ({ key: i.key, value: i.value }))));
    message.success('copy success🎉');
  };

  return (
    <div>
      <SpaceBetweenWrapper>
        <Typography.Text type='secondary'>{t('request.parameter_list')}</Typography.Text>

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

export default RequestParameters;
