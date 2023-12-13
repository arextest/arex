import { css, styled, Theme, useArexCoreConfig } from '@arextest/arex-core';
import { Editor, OnMount } from '@monaco-editor/react';
import { Button, Typography } from 'antd';
import * as monaco from 'monaco-editor';
import { editor } from 'monaco-editor';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useArexRequestStore } from '../../hooks';
import { testCodeSnippet } from './snippets';

const { Text } = Typography;

export const RequestTestWrapper = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  justify-content: space-between;
  flex: 1;
  & > div:last-of-type {
    width: 35%;
    text-align: left;
    padding-left: 8px;
  }
`;

const editorOptions: editor.IStandaloneEditorConstructionOptions = {
  minimap: {
    enabled: false,
  },
  fontSize: 12,
  wordWrap: 'on',
  automaticLayout: true,
  fontFamily: 'IBMPlexMono, "Courier New", monospace',
  scrollBeyondLastLine: false,
};

const RequestTests = () => {
  const { store, dispatch } = useArexRequestStore();
  const { t } = useTranslation();
  const { theme } = useArexCoreConfig();

  const arexData = [
    {
      name: 'com.xx.xxxxx.xxxx.1',
      category: 'soa',
      requestSchema: {
        requestKey1: {
          requestSubKey1: 'subValue1',
          requestSubKey2: 'subValue2',
        },
        requestKey2: 'value2',
        requestKey3: 'value3',
      },
      responseSchema: {
        responseKey1: {
          responseSubKey1: 'subValue1',
          responseSubKey2: 'subValue2',
        },
        responseKey2: 'value2',
        responseKey3: 'value3',
      },
    },
    {
      name: 'com.xx.xxxxx.xxxx.2',
      category: 'db',
      requestSchema: {
        requestKey1: {
          requestSubKey1: 'subValue1',
          requestSubKey2: 'subValue2',
        },
        requestKey2: 'value2',
        requestKey3: 'value3',
      },
      responseSchema: {
        responseKey1: {
          responseSubKey1: 'subValue1',
          responseSubKey2: 'subValue2',
        },
        responseKey2: 'value2',
        responseKey3: 'value3',
      },
    },
  ];

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // here is the editor instance
    // you can store it in `useRef` for further usage
    if (!store.request.testScript.includes('const AREX')) {
      const AREX = arexData.reduce<Record<string, any>>((arex, item) => {
        if (!arex[item.category]) {
          arex[item.category] = {
            [item.name]: {
              requestSchema: item.requestSchema,
              responseSchema: item.responseSchema,
            },
          };
        } else {
          arex[item.category][item.name] = {
            requestSchema: item.requestSchema,
            responseSchema: item.responseSchema,
          };
        }

        return arex;
      }, {});

      dispatch((state) => {
        state.request.testScript =
          `//#AREX Definition
const AREX = ${JSON.stringify(AREX, null, 2)}
//#End AREX Definition

` + state.request.testScript;
      });
    }

    editor.trigger('fold', 'editor.foldAll', {
      levels: 1,
      direction: 'down',
    });
  };

  const ThemeColorPrimaryButton = styled(Button)`
    color: ${(props) => props.theme.colorPrimary} !important;
  `;
  const codeSnippet = testCodeSnippet;

  const addTest = (text: string) => {
    dispatch((state) => {
      state.request.testScript = state.request.testScript += text;
    });
  };

  useEffect(() => {
    monaco.languages.setLanguageConfiguration('javascript', {
      comments: {
        lineComment: '//',
        blockComment: ['/*', '*/'],
      },
      brackets: [['{', '}']],
      folding: {
        markers: {
          start: new RegExp('\\s*//\\s*#AREX Definition\\b'),
          end: new RegExp('\\s*//\\s*#End AREX Definition\\b'),
        },
      },
    });
  }, []);

  return (
    <div
      css={css`
        height: 100%;
        display: flex;
        flex-direction: column;
      `}
    >
      <Typography.Text type='secondary'>{t('preRequest.javascript_code')}</Typography.Text>

      <RequestTestWrapper>
        <div
          css={css`
            min-width: 0;
            flex: 1;
            padding-bottom: 8px;
          `}
        >
          <Editor
            theme={theme === Theme.dark ? 'vs-dark' : 'light'}
            options={editorOptions}
            language={'javascript'}
            value={store.request.testScript}
            onMount={handleEditorDidMount}
            onChange={(value) => {
              dispatch((state) => {
                if (value !== undefined) {
                  state.request.testScript = value;
                }
              });
            }}
          />
        </div>

        <div
          css={css`
            display: flex;
            flex-direction: column;
          `}
        >
          <Text type={'secondary'}>
            Test scripts are written in JavaScript, and are run after the response is received.
          </Text>
          <a
            type='text'
            rel='noreferrer'
            target={'_blank'}
            href={'https://learning.postman.com/docs/writing-scripts/test-scripts/'}
            style={{ marginLeft: '8px' }}
          >
            Read documentation
          </a>

          <br />

          <Text type={'secondary'}>Snippets</Text>
          <div>
            {codeSnippet.map((snippet, i) => (
              <ThemeColorPrimaryButton
                key={i}
                size='small'
                type='text'
                onClick={() => addTest(snippet.text)}
              >
                {snippet.name}
              </ThemeColorPrimaryButton>
            ))}
          </div>
        </div>
      </RequestTestWrapper>
    </div>
  );
};

export default RequestTests;
