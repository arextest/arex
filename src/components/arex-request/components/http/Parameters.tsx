import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useImmer } from 'use-immer';

import { GlobalContext, HttpContext } from '../..';
import { HoppRESTParam } from '../../data/rest';
import FormHeader from './FormHeader';
import FormTable, { KeyValueType, useColumns } from './FormTable';

const HttpParameters = () => {
  const { store, dispatch } = useContext(HttpContext);
  const { t } = useTranslation();
  const [requestParams, setRequestParams] = useImmer<HoppRESTParam[]>([]);
  useEffect(() => {
    setRequestParams(
      store.request.params.map((i) => ({
        ...i,
        id: String(Math.random()),
      })),
    );
  }, []);

  useEffect(() => {
    dispatch({
      type: 'request.params',
      payload: requestParams,
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
        columns={useColumns(setRequestParams, true)}
      />
    </div>
  );
};

export default HttpParameters;
