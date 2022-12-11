import { EditorView } from '@codemirror/view';
import { FC, useContext, useRef } from 'react';

import { useCodeMirror } from '../../../helpers/editor/codemirror';
import { HoppRESTResponse } from '../../../helpers/types/HoppRESTResponse';
import { HttpContext } from '../../../index';

const RawLensRenderer: FC<{ response: HoppRESTResponse }> = ({ response }) => {
  const jsonResponse = useRef(null);
  const { store } = useContext(HttpContext);
  useCodeMirror({
    container: jsonResponse.current,
    value: response.type === 'success' ? JSON.stringify(response.body) : '',
    height: '100%',
    extensions: [EditorView.lineWrapping],
    lineWrapping: true,
    theme: store.theme,
  });
  return (
    <div>
      <div ref={jsonResponse}></div>
    </div>
  );
};

export default RawLensRenderer;
