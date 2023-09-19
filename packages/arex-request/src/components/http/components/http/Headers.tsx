import { useContext, useEffect } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useImmer } from 'use-immer';

import { Context } from '../../../../providers/ConfigProvider';
import FormHeader from './FormHeader';
import FormTable, { useColumns } from './FormTable';
const HttpHeaders = () => {
  const { t } = useTranslation();
  const { store, dispatch } = useContext(Context);
  const [requestHeaders, setRequestHeaders] = useImmer<any>([]);
  useEffect(() => {
    setRequestHeaders(
      store.request.headers.map((i: any) => ({
        ...i,
        id: String(Math.random()),
      })),
    );
  }, []);

  useEffect(() => {
    dispatch((state) => {
      state.request.headers = requestHeaders;
    });
  }, [requestHeaders]);

  return (
    <div>
      <FormHeader
        dataSource={requestHeaders}
        update={setRequestHeaders}
        title={t('request.header_list')}
      />
      <FormTable
        size='small'
        rowKey={'id'}
        pagination={false}
        dataSource={requestHeaders}
        // @ts-ignore
        columns={useColumns(setRequestHeaders, true)}
      />
    </div>
  );
};

export default HttpHeaders;
