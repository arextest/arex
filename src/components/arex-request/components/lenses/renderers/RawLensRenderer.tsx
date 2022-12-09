import { EditorView } from '@codemirror/view';
import { FC, useContext, useRef } from 'react';

import { useStore } from '../../../../../store';
import { useCodeMirror } from '../../../helpers/editor/codemirror';
import { HoppRESTResponse } from '../../../helpers/types/HoppRESTResponse';
import { useHttpStore } from '../../../store/useHttpStore';
const RawLensRenderer: FC<{ response: HoppRESTResponse }> = ({ response }) => {
  const jsonResponse = useRef(null);
  const { theme } = useHttpStore();
  useCodeMirror({
    container: jsonResponse.current,
    value: response?.type === 'success' ? JSON.stringify(response.body) : '',
    height: '300px',
    extensions: [EditorView.lineWrapping],
    lineWrapping: true,
    theme: theme,
  });
  return (
    <div>
      <div ref={jsonResponse}></div>
    </div>
  );
};

export default RawLensRenderer;
