import styled from '@emotion/styled';
import { useImmer } from 'use-immer';
import { HoppRESTHeader, HoppRESTParam } from '../../data/rest';

import FormHeader from './FormHeader';
import FormTable, { KeyValueType, useColumns } from './FormTable';
import { useContext, useEffect } from 'react';
// import { HttpContext } from "../panes/Request";
import { useMount } from 'ahooks';
import { HttpContext } from '../..';

const HttpHeaders = () => {
  const { store, dispatch } = useContext(HttpContext);
  const [requestHeaders, setRequestHeaders] = useImmer<HoppRESTHeader[]>([
    { key: '', value: '', active: true },
  ]);
  useMount(() => {
    setRequestHeaders(store.request.headers);
  });

  useEffect(() => {
    dispatch({
      type: 'request.headers',
      payload: requestHeaders,
    });
  }, [requestHeaders]);
  return (
    <div>
      <FormHeader update={setRequestHeaders} />
      <FormTable
        bordered
        size='small'
        rowKey='id'
        pagination={false}
        dataSource={requestHeaders}
        columns={useColumns(setRequestHeaders, true)}
      />
    </div>
  );
};

export default HttpHeaders;
