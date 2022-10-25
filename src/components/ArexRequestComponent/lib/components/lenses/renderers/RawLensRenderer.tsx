import { json } from '@codemirror/lang-json';
import { EditorView } from '@codemirror/view';
import { FC, useRef } from 'react';

import { useCodeMirror } from '../../../helpers/editor/codemirror';
import { HoppRESTResponse } from '../../../helpers/types/HoppRESTResponse';

const RawLensRenderer: FC<{ response: HoppRESTResponse }> = ({ response }) => {
  const jsonResponse = useRef(null);

  useCodeMirror({
    container: jsonResponse.current,
    value: response.body,
    height: '300px',
    extensions: [EditorView.lineWrapping],
    lineWrapping: true,
    theme: 'dark',
  });
  return (
    <div>
      {/*{JSON.stringify(response)}*/}
      <div ref={jsonResponse}></div>
    </div>
  );
};

export default RawLensRenderer;
