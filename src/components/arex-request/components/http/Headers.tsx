import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useImmer } from 'use-immer';

import { useHttpRequestStore } from '../../store/useHttpRequestStore';
import FormHeader from './FormHeader';
import FormTable, { KeyValueType, useColumns } from './FormTable';

const HttpHeaders = () => {
  const { t } = useTranslation();
  const { headers, setHttpRequestStore } = useHttpRequestStore();
  const [requestHeaders, setRequestHeaders] = useImmer<any>([]);

  useEffect(() => {
    setRequestHeaders(
      headers.map((i: any) => ({
        ...i,
        id: String(Math.random()),
      })),
    );
  }, []);

  useEffect(() => {
    setHttpRequestStore((state) => {
      state.headers = requestHeaders;
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
        // @ts-ignore
        columns={useColumns(setRequestHeaders, true)}
      />
    </div>
  );
};

export default HttpHeaders;
