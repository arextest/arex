import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useImmer } from 'use-immer';

import { GlobalContext, HttpContext } from '../..';
import { HoppRESTHeader } from '../../data/rest';
import FormHeader from './FormHeader';
import FormTable, { KeyValueType, useColumns } from './FormTable';

const HttpHeaders = () => {
  const { t } = useTranslation();
  const { store, dispatch } = useContext(HttpContext);
  const [requestHeaders, setRequestHeaders] = useImmer<HoppRESTHeader[]>([]);

  useEffect(() => {
    setRequestHeaders(
      store.request.headers.map((i) => ({
        ...i,
        id: String(Math.random()),
      })),
    );
  }, []);

  useEffect(() => {
    dispatch({
      type: 'request.headers',
      payload: requestHeaders,
    });
  }, [requestHeaders]);
  return (
    <div>
      <FormHeader update={setRequestHeaders} title={t('request.header_list')} />
      <FormTable
        bordered
        size='small'
        rowKey={'id'}
        pagination={false}
        dataSource={requestHeaders}
        columns={useColumns(setRequestHeaders, true)}
      />
    </div>
  );
};

export default HttpHeaders;
