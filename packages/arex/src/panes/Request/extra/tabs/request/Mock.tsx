import { SaveOutlined } from '@ant-design/icons';
import { Editor } from '@monaco-editor/react';
import { useRequest } from 'ahooks';
import { App, Col, Collapse, Row, Space } from 'antd';
import { tryParseJsonString, tryStringifyJson } from '@arextest/arex-core';
import { EmptyWrapper, TooltipButton } from '@arextest/arex-core';
import React, { FC } from 'react';
import { useImmer } from 'use-immer';

import request from '@/utils/request';

import useUserProfile from '../../../../../store/useUserProfile';

type MockTarget = {
  body: string | null;
  bodyParsed?: Record<string, any> | null;
  attributes: Record<string, any> | null;
  type: string | null;
};

type MockTargetParsed = { body?: string | null } & Omit<MockTarget, 'body'>;

type MockData = {
  id: string;
  categoryType: {
    name: string;
    entryPoint: boolean;
    skipComparison: boolean;
  };
  replayId: string | null;
  recordId: string;
  appId: string;
  recordEnvironment: number;
  creationTime: number;
  targetRequest: MockTarget;
  targetRequestString?: string;
  targetResponse: MockTarget;
  targetResponseString?: string;
  operationName: string;
};

type MockDataParse = Omit<MockData, 'targetRequest' | 'targetResponse'> & {
  targetRequest: MockTargetParsed;
  targetResponse: MockTargetParsed;
};

const Mock: FC<{ recordId: string }> = ({ recordId }) => {
  const { message } = App.useApp();
  const { theme } = useUserProfile();
  const [mockData, setMockData] = useImmer<MockDataParse[]>([]);

  const { run: getMockData, loading } = useRequest<MockDataParse[], []>(
    () =>
      request
        .post<{ recordResult: MockData[] }>(`/storage/storage/replay/query/viewRecord`, {
          recordId,
          sourceProvider: 'Pinned',
        })
        .then((res: any) =>
          Promise.resolve(
            res.recordResult.map((result: any) => {
              result.targetRequest.bodyParsed = tryParseJsonString<Record<string, any>>(
                result.targetRequest.body,
              );
              result.targetResponse.bodyParsed = tryParseJsonString<Record<string, any>>(
                result.targetResponse.body,
              );

              const convertData = (data: MockTarget) => {
                const { body, bodyParsed, ...rest } = data;
                return tryStringifyJson({ body: bodyParsed || body, ...rest }, undefined, true);
              };

              return {
                ...result,
                targetRequestString: convertData(result.targetRequest),
                targetResponseString: convertData(result.targetResponse),
              };
            }),
          ),
        ),
    {
      onSuccess(res) {
        setMockData(res);
      },
    },
  );

  const { run: updateMockData } = useRequest(
    (params) =>
      request.post<{
        responseStatusType: {
          responseCode: number;
          responseDesc: string;
          timestamp: number;
        };
      }>(`/storage/storage/edit/pinned/update/`, params),
    {
      manual: true,
      onSuccess(res) {
        message.success('Update successfully');
        if (!res.responseStatusType.responseCode) {
          getMockData();
        }
      },
    },
  );

  const handleSave = (id: string) => {
    const data = mockData.find((item) => item.id === id);
    if (!data) return;

    const { targetRequestString, targetResponseString, ...params }: any = data;

    params.targetRequest = tryParseJsonString(targetRequestString);
    params.targetResponse = tryParseJsonString(targetResponseString);

    typeof params.targetRequest.body !== 'string' &&
      // @ts-ignore
      (params.targetRequest.body = tryStringifyJson(params.targetRequest.body));

    typeof params.targetResponse.body !== 'string' &&
      // @ts-ignore
      (params.targetResponse.body = tryStringifyJson(params.targetResponse.body));

    updateMockData(params);
  };

  return (
    <Space direction='vertical' style={{ width: '100%' }}>
      <EmptyWrapper loading={loading} empty={!mockData.length}>
        <Space direction='vertical' style={{ width: '100%' }}>
          <Collapse defaultActiveKey={mockData.map((mock) => mock.id)}>
            {mockData.map((mock) => (
              <Collapse.Panel
                key={mock.id}
                header={mock.operationName}
                extra={
                  <TooltipButton
                    title={'Save'}
                    icon={<SaveOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSave(mock.id);
                    }}
                  />
                }
              >
                <Row gutter={16}>
                  <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
                    <Editor
                      options={{
                        minimap: {
                          enabled: false,
                        },
                        fontSize: 12,
                        wordWrap: 'wordWrapColumn',
                        automaticLayout: true,
                        fontFamily: 'IBMPlexMono, "Courier New", monospace',
                        scrollBeyondLastLine: false,
                      }}
                      theme={theme === 'dark' ? 'vs-dark' : 'light'}
                      height={'260px'}
                      value={mock.targetRequestString as string}
                      onChange={(value) => {
                        setMockData((state) => {
                          const data = state.find((item) => item.id === mock.id);
                          data && (data.targetRequestString = value);
                        });
                      }}
                      language={'json'}
                    />
                  </Col>
                  <Col span={12}>
                    <Editor
                      options={{
                        minimap: {
                          enabled: false,
                        },
                        fontSize: 12,
                        wordWrap: 'wordWrapColumn',
                        automaticLayout: true,
                        fontFamily: 'IBMPlexMono, "Courier New", monospace',
                        scrollBeyondLastLine: false,
                      }}
                      theme={theme === 'dark' ? 'vs-dark' : 'light'}
                      height={'260px'}
                      value={mock.targetResponseString as string}
                      onChange={(value) => {
                        setMockData((state) => {
                          const data = state.find((item) => item.id === mock.id);
                          data && (data.targetResponseString = value);
                        });
                      }}
                      language={'json'}
                    />
                  </Col>
                </Row>
              </Collapse.Panel>
            ))}
          </Collapse>
        </Space>
      </EmptyWrapper>
    </Space>
  );
};
export default Mock;
