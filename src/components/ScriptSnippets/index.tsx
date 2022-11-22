import { javascript } from '@codemirror/lang-javascript';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import CodeMirror from '@uiw/react-codemirror';
import { Button, Space, Spin } from 'antd';
import React, { FC, ReactNode } from 'react';

import { useStore } from '../../store';

export type Snippet = {
  name: string;
  script: string;
};

const defaultSnippet: Snippet[] = [
  {
    name: 'Response: Status code is 200',
    script: `
// Check status code is 200
arex.test("Status code is 200", ()=> {
    arex.expect(arex.response.status).toBe(200);
});
`,
  },
];

export type ScriptSnippetsProps = {
  height?: string;
  disabled?: boolean;
  value: string;
  disabledSnippets?: boolean;
  snippets?: false | { header?: ReactNode; data?: Snippet[] };
  onChange?: (value: string) => void;
};

const ScriptSnippetsWrapper = styled.div<{ height?: string }>`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  .snippets {
    padding: 0 16px;
    width: 300px;
    height: ${(props) => props.height};
    overflow: auto;
    flex-grow: 0;
    .snippets-header {
      margin-bottom: 8px;
      color: ${(props) => props.theme.color.text.secondary};
    }
  }
`;

const ScriptSnippets: FC<ScriptSnippetsProps> = ({
  disabled,
  height = '300px',
  value,
  snippets = {
    header: 'Test scripts are written in JavaScript, and are run before the request is sent.',
    data: defaultSnippet,
  },
  onChange,
}) => {
  const { themeClassify } = useStore();
  const { color } = useTheme();

  return (
    <Spin indicator={<></>} spinning={!!disabled}>
      <ScriptSnippetsWrapper height={height}>
        <CodeMirror
          value={value}
          height={height}
          extensions={[javascript()]}
          theme={themeClassify}
          onChange={onChange}
          style={{ width: '60%', flexGrow: 1 }}
        />
        {snippets && (
          <div className='snippets'>
            <div className='snippets-header'>{snippets.header}</div>
            <Space size='small' direction='vertical'>
              {snippets.data?.map((snippet, index) => (
                <Button
                  type='text'
                  size='small'
                  key={index}
                  onClick={() => {
                    onChange?.(value + snippet.script);
                  }}
                  style={{ color: color.primary }}
                >
                  {snippet.name}
                </Button>
              ))}
            </Space>
          </div>
        )}
      </ScriptSnippetsWrapper>
    </Spin>
  );
};

export default ScriptSnippets;
