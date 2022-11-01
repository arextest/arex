import styled from '@emotion/styled';
import { useMount } from 'ahooks';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useImmer } from 'use-immer';

import { GlobalContext, HttpContext } from '../..';
import { HoppRESTParam } from '../../data/rest';
import FormHeader from './FormHeader';
import FormTable, { KeyValueType, useColumns } from './FormTable';
import { getValueByPath } from '../../helpers/utils/locale';

const HttpParameters = () => {
  const { store, dispatch } = useContext(HttpContext);
  const t = (key) => getValueByPath(globalStore.locale.locale, key);
  const { dispatch: globalDispatch, store: globalStore } = useContext(GlobalContext);
  const [requestParams, setRequestParams] = useImmer<HoppRESTParam[]>([]);
  useMount(() => {
    setRequestParams(
      store.request.params.map((i) => ({
        ...i,
        id: String(Math.random()),
      })),
    );
  });

  useEffect(() => {
    dispatch({
      type: 'request.params',
      payload: requestParams,
    });
    console.log(requestParams, 'req');
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
