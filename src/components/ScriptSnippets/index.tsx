import { javascript } from '@codemirror/lang-javascript';
import styled from '@emotion/styled';
import CodeMirror from '@uiw/react-codemirror';
import { Button, Space, Spin, theme } from 'antd';
import React, { ReactNode } from 'react';

import useUserProfile from '../../store/useUserProfile';
import { ScriptBlocksFC } from '../PreRequestScript';

export type Snippet = {
  name: string;
  script: string;
};

const { useToken } = theme;

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
  snippets?: false | { header?: ReactNode; data?: Snippet[] };
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
      color: ${(props) => props.theme.colorTextSecondary};
    }
  }
`;

const ScriptSnippets: ScriptBlocksFC<string, ScriptSnippetsProps> = ({
  disabled,
  height = '300px',
  value,
  snippets = {
    header: 'Test scripts are written in JavaScript, and are run before the request is sent.',
    data: defaultSnippet,
  },
  onChange,
}) => {
  const { theme } = useUserProfile();
  const { token } = useToken();

  return (
    <Spin indicator={<div></div>} spinning={!!disabled}>
      <ScriptSnippetsWrapper height={height}>
        <CodeMirror
          value={value}
          height={height}
          extensions={[javascript()]}
          theme={theme}
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
                  style={{ color: token.colorPrimary }}
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
