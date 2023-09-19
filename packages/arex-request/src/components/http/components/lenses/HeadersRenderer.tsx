import { FC } from 'react';
import React from 'react';

import { HoppRESTHeader } from '../../data/rest';
import LensesHeadersRendererEntry from './HeadersRendererEntry';

const LensesHeadersRenderer: FC<{ headers: HoppRESTHeader[] }> = ({ headers }) => {
  return (
    <div>
      {headers.map((header, index) => {
        return <LensesHeadersRendererEntry key={index} header={header} />;
      })}
    </div>
  );
};

export default LensesHeadersRenderer;
