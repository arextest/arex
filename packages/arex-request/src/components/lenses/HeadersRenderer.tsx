import { FC } from 'react';
import React from 'react';

import { ArexRESTHeader } from '../../types';
import LensesHeadersRendererEntry from './HeadersRendererEntry';

const LensesHeadersRenderer: FC<{ headers?: ArexRESTHeader[] }> = (props) => {
  return (
    <div>
      {props.headers?.map((header, index) => (
        <LensesHeadersRendererEntry key={index} header={header} />
      ))}
    </div>
  );
};

export default LensesHeadersRenderer;
