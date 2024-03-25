import { CloseOutlined, OpenAIOutlined } from '@ant-design/icons';
import { css, styled, Theme, useArexCoreConfig } from '@arextest/arex-core';
import { Editor } from '@monaco-editor/react';
import { Button, Drawer, FloatButton, Typography } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useArexRequestStore } from '../../hooks';
import { testCodeSnippet } from './snippets';
import TextArea from 'antd/es/input/TextArea';

const { Text } = Typography;

const RequestTestWrapper = styled.div`
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

  const [aiDrawerOpen, setOpen] = useState<boolean>();

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
      <Typography.Text type='secondary'>{t('preRequest.javascript_code')}</Typography.Text>

      <RequestTestWrapper>
        <div
          css={css`
            min-width: 0;
            flex: 1;
            position: relative;
          `}
        >
          <Button
            icon={<OpenAIOutlined />}
            onClick={() => setOpen(true)}
            type='primary'
            style={{ position: 'absolute', right: 24, top: 24, zIndex: 999 }}
          />
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
          <Drawer
            title='Arex Bot'
            placement='right'
            open={aiDrawerOpen}
            mask={false}
            getContainer={false}
            onClose={() => setOpen(false)}
            closable={false}
            extra={<Button onClick={() => setOpen(false)} type='link' icon={<CloseOutlined />} />}
          >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ height: '90%' }}></div>
              <TextArea
                placeholder='Autosize height based on content lines'
                autoSize={{ minRows: 2 }}
              />
            </div>
          </Drawer>

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
