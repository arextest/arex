import { copyToClipboard } from '@arextest/arex-core';
import { App } from 'antd';
import React from 'react';

import { useArexRequestStore } from '../../hooks';
import HeaderActionBar from './HeaderActionBar';
import HeaderTable, { HeaderData } from './HeaderTable';

const HttpHeaders = () => {
  const { message } = App.useApp();
  const { store, dispatch } = useArexRequestStore();

  const handleEditHeader = (header: HeaderData | HeaderData[] | undefined = []) => {
    dispatch((state) => {
      if (Array.isArray(header)) state.request.headers = header;
      else state.request.headers.push(header);
    });
  };

  const copyUrl = () => {
    copyToClipboard(
      JSON.stringify(
        store.request.headers
          .filter((header) => header.active)
          .map(({ key, value }) => ({ key, value })),
        null,
        2,
      ),
    );
    message.success('copy success🎉');
  };

  return (
    <>
      <HeaderActionBar onCopy={copyUrl} onInsert={handleEditHeader} onClearAll={handleEditHeader} />

      <HeaderTable
        editable
        size='small'
        rowKey='id'
        pagination={false}
        dataSource={store.request.headers}
        onEdit={handleEditHeader}
      />
    </>
  );
};

export default HttpHeaders;
