import { FC } from 'react';

import { HoppRESTHeader } from '../../data/rest';
import LensesHeadersRendererEntry from './HeadersRendererEntry';

const LensesHeadersRenderer: FC<{ headers: HoppRESTHeader[] }> = ({ headers }) => {
  console.log(headers, 'headers');
  return (
    <div>
      {[].map((header, index) => {
        return <LensesHeadersRendererEntry key={index} header={header} />;
      })}
    </div>
  );
};

export default LensesHeadersRenderer;
