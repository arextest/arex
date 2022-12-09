import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useImmer } from 'use-immer';

import { useHttpRequestStore } from '../../store/useHttpRequestStore';
import FormHeader from './FormHeader';
import FormTable, { useColumns } from './FormTable';

const HttpParameters = () => {
  const { t } = useTranslation();
  const { params, setHttpRequestStore } = useHttpRequestStore();
  const [requestParams, setRequestParams] = useImmer<any[]>([]);
  useEffect(() => {
    setRequestParams(
      params.map((i: any) => ({
        ...i,
        id: String(Math.random()),
      })),
    );
  }, []);

  useEffect(() => {
    setHttpRequestStore((state) => {
      state.params = requestParams
    });
  }, [requestParams]);

  return (
    <div>
      <FormHeader title={t('request.parameter_list')} update={setRequestParams} />
      <FormTable
        bordered
        rowKey={'id'}
        size='small'
        pagination={false}
        dataSource={requestParams}
        // @ts-ignore
        columns={useColumns(setRequestParams, true)}
      />
    </div>
  );
};

export default HttpParameters;
