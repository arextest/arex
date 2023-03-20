import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useImmer } from 'use-immer';

import { KeyValueType } from '../../../../services/FileSystem.type';
import { HttpContext } from '../..';
import FormHeader from './FormHeader';
import FormTable, { useColumns } from './FormTable';

const HttpParameters = () => {
  const { store, dispatch } = useContext(HttpContext);
  const { t } = useTranslation();

  const [requestParams, setRequestParams] = useImmer<KeyValueType[]>(
    store.request.params?.map((i) => ({
      ...i,
      id: String(Math.random()),
    })),
  );

  useEffect(() => {
    dispatch((state) => {
      state.request.params = requestParams;
    });
  }, [requestParams]);

  return (
    <>
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
    </>
  );
};

export default HttpParameters;
