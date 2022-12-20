import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { LanguageSupport } from '@codemirror/language';
import styled from '@emotion/styled';
import CodeMirror from '@uiw/react-codemirror';
import { Button, Divider, Spin, Typography } from 'antd';
import React, { ReactNode } from 'react';

import useUserProfile from '../../store/useUserProfile';
import { ScriptBlocksFC } from '../PreRequestScript';

export type Snippet = {
  name: string;
  script: string;
};

export type CodeMirrorExtensions = 'javascript' | 'json';

export type Snippets = { header?: ReactNode; data?: Snippet[] };

export type ScriptSnippetsProps = {
  snippets?: false | Snippets | Snippets[];
  language?: CodeMirrorExtensions;
};

const defaultSnippet: Snippet[] = [
  {
    name: 'Response: Status code is 200',
    text: `
// Check status code is 200
arex.test("Status code is 200", ()=> {
    arex.expect(arex.response.status).toBe(200);
});
`,
  },
  {
    name: 'Response: Assert property from body',
    text: `
// Check JSON response property
arex.test("Check JSON response property", ()=> {
    arex.expect(arex.response.body.age).toBe(18);
});
`,
  },
  {
    name: 'Status code: Status code is 2xx',
    text: `
// Check status code is 2xx
arex.test("Status code is 2xx", ()=> {
    arex.expect(arex.response.status).toBeLevel2xx();
});`,
  },
  {
    name: 'Status code: Status code is 3xx',
    text: `
// Check status code is 3xx
arex.test("Status code is 3xx", ()=> {
    arex.expect(arex.response.status).toBeLevel3xx();
});`,
  },
  {
    name: 'Status code: Status code is 4xx',
    text: `
// Check status code is 4xx
arex.test("Status code is 4xx", ()=> {
    arex.expect(arex.response.status).toBeLevel4xx();
});`,
  },
  {
    name: 'Status code: Status code is 5xx',
    text: `
// Check status code is 5xx
arex.test("Status code is 5xx", ()=> {
    arex.expect(arex.response.status).toBeLevel5xx();
});`,
  },
].map((s) => ({ name: s.name, script: s.text }));

const CodeMirrorExtensionsMap: { [language in CodeMirrorExtensions]: LanguageSupport } = {
  javascript: javascript(),
  json: json(),
};

const SnippetBlock = styled((props: { snippet: Snippets; onChange?: (script: string) => void }) => {
  const { snippet, onChange, ...restProps } = props;
  return (
    <div {...restProps}>
      <Typography.Text type='secondary'>{snippet.header}</Typography.Text>

      {snippet.data?.map((snippet, index) => (
        <Button
          type='text'
          size='small'
          key={index}
          onClick={() => {
            onChange?.(snippet.script);
          }}
        >
          {snippet.name}
        </Button>
      ))}
    </div>
  );
})`
  .ant-typography-secondary {
    display: inline-block;
    margin-bottom: 8px;
  }
  .ant-btn-text {
    color: ${(props) => props.theme.colorPrimary};
  }
`;

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
  }
`;

const ScriptSnippets: ScriptBlocksFC<string, ScriptSnippetsProps> = ({
  language,
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

  return (
    <Spin indicator={<div></div>} spinning={!!disabled}>
      <ScriptSnippetsWrapper height={height}>
        <CodeMirror
          value={value}
          height={height}
          extensions={language && [CodeMirrorExtensionsMap[language]]}
          theme={theme}
          onChange={onChange}
          style={{ width: '60%', flexGrow: 1 }}
        />
        {snippets && (
          <div className='snippets'>
            {Array.isArray(snippets) ? (
              snippets.map((snippet, index) => (
                <div key={index}>
                  <SnippetBlock
                    snippet={snippet}
                    onChange={(script) => onChange?.(value + script)}
                  />
                  {index !== snippets.length - 1 && <Divider style={{ margin: '16px 0' }} />}
                </div>
              ))
            ) : (
              <SnippetBlock snippet={snippets} onChange={(script) => onChange?.(value + script)} />
            )}
          </div>
        )}
      </ScriptSnippetsWrapper>
    </Spin>
  );
};

export default ScriptSnippets;
