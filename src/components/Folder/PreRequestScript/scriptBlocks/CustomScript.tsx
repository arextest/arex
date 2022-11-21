import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from '@uiw/react-codemirror';
import React, { FC } from 'react';

import { useStore } from '../../../../store';

type CustomScriptProps = {
  value: string;
  onChange: (value: string) => void;
};

const CustomScript: FC<CustomScriptProps> = (props) => {
  const { themeClassify } = useStore();

  return (
    <CodeMirror
      value={props.value}
      height='300px'
      extensions={[javascript()]}
      theme={themeClassify}
      onChange={props.onChange}
    />
  );
};

export default CustomScript;
