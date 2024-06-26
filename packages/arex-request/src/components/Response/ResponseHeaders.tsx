import React, { FC } from 'react';

import { ArexRESTHeader } from '../../types';
import HeadersTable from '../HeadersTable';

const ResponseHeaders: FC<{ headers?: ArexRESTHeader[] }> = (props) => {
  return (
    <HeadersTable
      size='small'
      pagination={false}
      dataSource={props.headers}
      style={{ marginTop: '8px' }}
    />
  );
};

export default ResponseHeaders;
