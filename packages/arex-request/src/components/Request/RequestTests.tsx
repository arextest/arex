import { CloseOutlined, OpenAIOutlined, SendOutlined } from '@ant-design/icons';
import { css, styled, Theme, useArexCoreConfig } from '@arextest/arex-core';
import { Editor } from '@monaco-editor/react';
import { useRequest } from 'ahooks';
import { Button, Card, Divider, Drawer, Skeleton, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useArexRequestProps, useArexRequestStore } from '../../hooks';
import { testCodeSnippet } from './snippets';
import { ArexLogoIcon } from '@arextest/arex-core/src/components/icons/ArexLogoIcon';

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

type ChatHistory = {
  userMsg: string;
  botMsg?: string;
};

const RequestTests = () => {
  const { store, dispatch } = useArexRequestStore();
  const { t } = useTranslation();
  const { theme, colorPrimary } = useArexCoreConfig();
  const { gptProvider } = useArexRequestProps();
  const ThemeColorPrimaryButton = styled(Button)`
    color: ${(props) => props.theme.colorPrimary} !important;
  `;
  const codeSnippet = testCodeSnippet;
  const addTest = (text: string) => {
    dispatch((state) => {
      state.request.testScript = state.request.testScript += '\n' + text;
    });
  };

  const [AIDrawerOpen, setOpen] = useState<boolean>();
  const [currentInput, setInput] = useState<string>();
  const [chatHistory, setHistory] = useState<ChatHistory[]>([]);

  // todo extract to props
  const { loading: gptLoading, run: gptRun } = useRequest(
    // this param is used in OnSuccess
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (historyIdx: number, input: string) => {
      // console.log(historyIdx, input);
      return gptProvider!({
        apiRes: store.response?.type === 'success' ? store.response.body : undefined,
        currentScript: store.request.testScript,
        requirement: input,
      });
    },
    {
      manual: true,
      onSuccess: (data, params) => {
        addTest(data?.code ?? '');
        setHistory((old) => {
          const newHistory = [...old];
          newHistory[params[0]].botMsg = data?.explanation ?? '';
          return newHistory;
        });
      },
    },
  );

  const sendAiMessage = useCallback(
    (input?: string) => {
      let newIdx = 0;
      const finalInput = input ? input : 'Generate basic tests.';
      setHistory((old) => {
        newIdx = old.length;
        return [...old, { userMsg: finalInput! }];
      });
      setInput('');
      gptRun(newIdx, finalInput);
    },
    [gptRun],
  );

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
            title={
              <div style={{ display: 'flex', alignItems: "center" }}>
                <ArexLogoIcon width={48} />
                <span>Arex Bot</span>
              </div>
            }
            placement='right'
            open={AIDrawerOpen}
            mask={false}
            getContainer={false}
            onClose={() => setOpen(false)}
            closable={false}
            extra={<Button onClick={() => setOpen(false)} type='link' icon={<CloseOutlined />} />}
          >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '90%',
                  overflowY: 'scroll',
                  paddingTop: 8,
                  paddingBottom: 8,
                }}
              >
                {chatHistory.map((chat, i) => (
                  <Card
                    key={i}
                    style={{ width: '100%', marginBottom: 16 }}
                    styles={{ body: { padding: 8 } }}
                  >
                    <div>
                      <Typography>{chat.userMsg}</Typography>
                    </div>
                    <Divider />
                    {chat.botMsg ? (
                      <Typography style={{ color: colorPrimary }}>{chat.botMsg}</Typography>
                    ) : (
                      <Skeleton active />
                    )}
                  </Card>
                ))}
              </div>

              {/*chat message input*/}
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <TextArea
                  placeholder='Enter your test requirements here...'
                  autoSize={{ minRows: 2, maxRows: 6 }}
                  onChange={(e) => setInput(e.target.value)}
                  value={currentInput}
                />
                <Button
                  style={{ marginLeft: 4 }}
                  icon={<SendOutlined />}
                  disabled={gptLoading}
                  onClick={() => {
                    sendAiMessage(currentInput);
                  }}
                />
              </div>
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
