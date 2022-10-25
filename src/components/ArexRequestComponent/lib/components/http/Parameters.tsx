import styled from '@emotion/styled';
import { useMount } from 'ahooks';
import { useContext, useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';

import { HttpContext } from '../..';
import { HoppRESTParam } from '../../data/rest';
import FormHeader from './FormHeader';
import FormTable, { KeyValueType, useColumns } from './FormTable';

const HttpParameters = () => {
  const { store, dispatch } = useContext(HttpContext);
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
      <FormHeader update={setRequestParams} />
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
