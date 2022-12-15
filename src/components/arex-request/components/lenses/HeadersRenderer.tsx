import { FC } from 'react';
import React from 'react';

import { HoppRESTHeader } from '../../data/rest';
import LensesHeadersRendererEntry from './HeadersRendererEntry';

const LensesHeadersRenderer: FC<{ headers: HoppRESTHeader[], onPin:any }> = ({ headers,onPin }) => {
  return (
    <div>
      {headers.map((header, index) => {
        return <LensesHeadersRendererEntry onPin={onPin} key={index} header={header} />;
      })}
    </div>
  );
};

export default LensesHeadersRenderer;
