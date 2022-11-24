import { EditorView } from '@codemirror/view';
import { FC, useRef } from 'react';
import useDarkMode from 'use-dark-style';

import { useCodeMirror } from '../../../helpers/editor/codemirror';
import { HoppRESTResponse } from '../../../helpers/types/HoppRESTResponse';

const RawLensRenderer: FC<{ response: HoppRESTResponse }> = ({ response }) => {
  const jsonResponse = useRef(null);
  const darkMode = useDarkMode();
  useCodeMirror({
    container: jsonResponse.current,
    value: response.body,
    height: '300px',
    extensions: [EditorView.lineWrapping],
    lineWrapping: true,
    theme: darkMode.value ? 'dark' : 'light',
  });
  return (
    <div>
      <div ref={jsonResponse}></div>
    </div>
  );
};

export default RawLensRenderer;
