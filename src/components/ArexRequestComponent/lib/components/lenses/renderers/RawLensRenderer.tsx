import { json } from '@codemirror/lang-json';
import { EditorView } from '@codemirror/view';
import { FC, useContext, useRef } from 'react';

import { useCodeMirror } from '../../../helpers/editor/codemirror';
import { HoppRESTResponse } from '../../../helpers/types/HoppRESTResponse';
import { GlobalContext } from '../../../index';

const RawLensRenderer: FC<{ response: HoppRESTResponse }> = ({ response }) => {
  const { store: globalStore } = useContext(GlobalContext);
  const jsonResponse = useRef(null);

  useCodeMirror({
    container: jsonResponse.current,
    value: response.body,
    height: '300px',
    extensions: [EditorView.lineWrapping],
    lineWrapping: true,
    theme: globalStore.theme.type,
  });
  return (
    <div>
      {/*{JSON.stringify(response)}*/}
      <div ref={jsonResponse}></div>
    </div>
  );
};

export default RawLensRenderer;
