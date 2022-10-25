import { FC, useRef } from 'react';
import { json } from '@codemirror/lang-json';
import { useCodeMirror } from '../../../helpers/editor/codemirror';
import { HoppRESTResponse } from '../../../helpers/types/HoppRESTResponse';

const RawLensRenderer: FC<{ response: HoppRESTResponse }> = ({ response }) => {
  const jsonResponse = useRef(null);

  useCodeMirror({
    container: jsonResponse.current,
    value: response.body,
    height: '300px',
    extensions: [],
  });
  return (
    <div>
      <div ref={jsonResponse}></div>
    </div>
  );
};

export default RawLensRenderer;
