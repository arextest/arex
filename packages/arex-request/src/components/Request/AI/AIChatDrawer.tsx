import { CloseOutlined, SendOutlined } from '@ant-design/icons';
import { ArexLogoIcon } from '@arextest/arex-core';
import { styled } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { Button, Card, Divider, Drawer, Skeleton, Space, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import * as React from 'react';
import { useState } from 'react';

import { useArexRequestProps, useArexRequestStore } from '../../../hooks';
import { AIPromptsPreset } from './AIPromptsPreset';

type Props = {
  AIDrawerOpen: boolean;
  setOpen: (v: boolean) => void;
  addTest: (text: string) => void;
};

type ChatHistory = {
  userMsg: string;
  botMsg?: string;
  needSend?: boolean;
  selfIdx: number;
};

export function AIChatDrawer(props: Props) {
  const { AIDrawerOpen, setOpen, addTest } = props;

  const { store, request } = useArexRequestStore();
  const { gptProvider } = useArexRequestProps();

  const [currentInput, setInput] = useState<string>();
  const [chatHistory, setHistory] = useState<ChatHistory[]>([]);

  const ThemeColorPrimaryTypo = styled(Typography)`
    color: ${(props) => props.theme.colorPrimary} !important;
  `;

  // todo extract to props
  const { loading: gptLoading, run: gptRun } = useRequest(
    // this param is used in OnSuccess
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (historyIdx: number, input: string, apiRes?: string) => {
      // console.log(historyIdx, input);
      return gptProvider!({
        apiRes: apiRes ?? (store.response?.type === 'success' ? store.response?.body : ''),
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
      onError: (error, params) => {
        setHistory((old) => {
          const newHistory = [...old];
          newHistory[params[0]].botMsg = 'Something went wrong, please try again...';
          return newHistory;
        });
      },
    },
  );

  const triggerTestGen = (input?: string) => {
    // extract input and reset
    const finalInput = input ? input : 'Generate basic tests.';
    setInput('');

    if (store.response?.type !== 'success' || !store.response.body) {
      setHistory((old) => {
        return [
          ...old,
          {
            userMsg: finalInput!,
            needSend: true,
            selfIdx: old.length,
          },
        ];
      });
    } else {
      let newIdx = 0;
      setHistory((old) => {
        newIdx = old.length;
        return [...old, { selfIdx: newIdx, userMsg: finalInput! }];
      });
      gptRun(newIdx, finalInput);
    }
  };

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
              <Divider style={{ marginTop: 4, marginBottom: 4 }} />
              {!chat.botMsg && !chat.needSend && <Skeleton active />}
              {chat.botMsg && <ThemeColorPrimaryTypo>{chat.botMsg}</ThemeColorPrimaryTypo>}
              {chat.needSend && (
                <Space direction='vertical'>
                  <ThemeColorPrimaryTypo>I need a response to continue.</ThemeColorPrimaryTypo>
                  <Button
                    block
                    onClick={async () => {
                      const res = await request();
                      setHistory((old) => {
                        const newHistory = [...old];
                        newHistory[chat.selfIdx].needSend = false;
                        return newHistory;
                      });
                      gptRun(
                        chat.selfIdx,
                        chat.userMsg,
                        res?.response?.type === 'success'
                          ? res.response.body
                          : 'Something went wrong with LLMs, please try later...',
                      );
                    }}
                  >
                    Send request and retry...
                  </Button>
                </Space>
              )}
            </Card>
          ))}
        </div>

        <div>
          <AIPromptsPreset
            disabled={gptLoading}
            onSelect={(prompt) => {
              triggerTestGen(prompt.promptText);
            }}
          />
          {/*chat message input*/}
          <div style={{ display: 'flex', alignItems: 'flex-end', marginTop: 8 }}>
            <TextArea
              variant='borderless'
              placeholder='Enter your test requirements here...'
              autoSize={{ minRows: 1, maxRows: 6 }}
              onChange={(e) => setInput(e.target.value)}
              value={currentInput}
            />
            <Button
              type='primary'
              style={{ marginLeft: 4 }}
              icon={<SendOutlined />}
              disabled={gptLoading}
              onClick={() => {
                triggerTestGen(currentInput);
              }}
            />
          </div>
        </div>
      </div>
    </Drawer>
  );
}
