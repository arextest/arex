import { FC } from 'react';
import React from 'react';

import { ArexRESTHeader } from '../../types';
import LensesHeadersRendererEntry from './HeadersRendererEntry';

const LensesHeadersRenderer: FC<{ headers: ArexRESTHeader[] }> = ({ headers }) => {
  return (
    <div>
      {headers.map((header, index) => {
        return <LensesHeadersRendererEntry key={index} header={header} />;
      })}
    </div>
  );
};

export default LensesHeadersRenderer;
