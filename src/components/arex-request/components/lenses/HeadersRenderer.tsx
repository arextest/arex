import { FC } from 'react';
import React from 'react';

import { HoppRESTHeader } from '../../data/rest';
import LensesHeadersRendererEntry, {
  LensesHeadersRendererEntryProps,
} from './HeadersRendererEntry';

const LensesHeadersRenderer: FC<{
  headers: HoppRESTHeader[] | null;
  onPin: LensesHeadersRendererEntryProps['onPin'];
}> = ({ headers, onPin }) => {
  return (
    <>
      {headers?.map((header, index) => (
        <LensesHeadersRendererEntry onPin={onPin} key={index} header={header} />
      ))}
    </>
  );
};

export default LensesHeadersRenderer;
