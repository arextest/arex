import { EditorView } from '@codemirror/view';
import React, { FC, useContext, useRef } from 'react';

import { useCodeMirror } from '../../../helpers/editor/codemirror';
import { HoppRESTResponse } from '../../../helpers/types/HoppRESTResponse';
import { HttpContext } from '../../../index';

const RawLensRenderer: FC<{ response: HoppRESTResponse | null }> = ({ response }) => {
  const jsonResponse = useRef(null);
  const { store } = useContext(HttpContext);

  useCodeMirror({
    container: jsonResponse.current,
    value: response?.type === 'success' ? JSON.stringify(response.body) : '',
    height: '100%',
    extensions: [EditorView.lineWrapping],
    lineWrapping: true,
    theme: store.theme,
  });

  return <div ref={jsonResponse} />;
};

export default RawLensRenderer;
