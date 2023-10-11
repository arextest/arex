import React, { FC } from 'react';

import { ArexRESTHeader } from '../../types';
import HeaderTable from '../http/HeaderTable';

const ResponseHeaders: FC<{ headers: ArexRESTHeader[] }> = (props) => {
  return (
    <HeaderTable
      size='small'
      pagination={false}
      dataSource={props.headers}
      style={{ marginTop: '8px' }}
    />
  );
};

export default ResponseHeaders;
