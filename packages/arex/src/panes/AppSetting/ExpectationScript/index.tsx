import { Editor } from '@arextest/monaco-react';
import { Button } from 'antd';
import * as monaco from 'monaco-editor';
import React, { FC, useState } from 'react';

import { useUserProfile } from '@/store';

export interface ExpectationScriptProps {
  appId: string;
}

const ExpectationScript: FC<ExpectationScriptProps> = (props) => {
  const { theme } = useUserProfile();
  const [value, setValue] = useState('');
  const [language, setLanguage] = useState<string>();

  const handleClick = () => {
    monaco.languages.register({ id: props.appId });
    monaco.languages.registerCompletionItemProvider(props.appId, {
      provideCompletionItems: (model, position) => {
        const suggestions = [
          ...['requer.key1.valuer1', 'requer.key2.valuer2'].map((k) => ({
            label: k,
            kind: monaco.languages.CompletionItemKind.Variable,
            insertText: k,
          })),
        ];
        return { suggestions };
      },
    });
    setLanguage(props.appId);
  };

  return (
    <div>
      <div>{props.appId}</div>
      <Button onClick={handleClick}>add lang</Button>
      <Editor
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        value={value}
        language={language}
        height={'400px'}
        onChange={(value) => {
          setValue(value || '');
        }}
      />
    </div>
  );
};

export default ExpectationScript;
