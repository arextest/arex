import { css, styled, Theme, useArexCoreConfig } from '@arextest/arex-core';
import { Editor } from '@monaco-editor/react';
import { Button, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useArexRequestStore } from '../../hooks';
import { testCodeSnippet } from './snippets';

const { Text } = Typography;
export const RequestTestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  & > span:first-of-type {
    font-size: 13px;
    line-height: 32px;
    font-weight: 500;
    color: #9d9d9d;
  }
`;

export const RequestTestWrapper = styled.div`
  overflow-y: auto;
  display: flex;
  justify-content: space-between;
  flex: 1;
  & > div:last-of-type {
    width: 35%;
    text-align: left;
    //border-left: 1px solid #eee;
    padding-left: 20px;
  }
`;

const editorOptions = {
  minimap: {
    enabled: false,
  },
  fontSize: 12,
  wordWrap: 'on',
  automaticLayout: true,
  fontFamily: 'IBMPlexMono, "Courier New", monospace',
  scrollBeyondLastLine: false,
} as const;

const RequestTests = () => {
  const { store, dispatch } = useArexRequestStore();
  const { t } = useTranslation();
  const { theme } = useArexCoreConfig();

  const ThemeColorPrimaryButton = styled(Button)`
    color: ${(props) => props.theme.colorPrimary} !important;
  `;
  const codeSnippet = testCodeSnippet;

  const addTest = (text: string) => {
    dispatch((state) => {
      state.request.testScript = state.request.testScript += text;
    });
  };
  return (
    <div
      css={css`
        height: 100%;
        display: flex;
        flex-direction: column;
      `}
    >
      <RequestTestHeader>
        <span>{t('preRequest.javascript_code')}</span>
      </RequestTestHeader>

      <RequestTestWrapper>
        <div
          css={css`
            min-width: 0;
            flex: 1;
            //width: 100%;
          `}
        >
          <Editor
            theme={theme === Theme.dark ? 'vs-dark' : 'light'}
            options={editorOptions}
            language={'javascript'}
            value={store.request.testScript}
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
          <Text
            type={'secondary'}
            css={css`
              margin-bottom: 4px;
            `}
          >
            Test scripts are written in JavaScript, and are run after the response is received.
          </Text>
          <div>
            <a
              type='text'
              onClick={() =>
                window.open('https://learning.postman.com/docs/writing-scripts/test-scripts/')
              }
              style={{ marginLeft: '8px' }}
            >
              Read documentation
            </a>
          </div>
          <Text
            type={'secondary'}
            css={css`
              padding: 16px 0;
            `}
          >
            Snippets
          </Text>
          <div
            css={css`
              overflow: auto;
              flex: 1;
            `}
          >
            {codeSnippet.map((e, i) => (
              <ThemeColorPrimaryButton
                key={i}
                size='small'
                type='text'
                onClick={() => addTest(e.text)}
              >
                {e.name}
              </ThemeColorPrimaryButton>
            ))}
          </div>
        </div>
      </RequestTestWrapper>
    </div>
  );
};

export default RequestTests;
