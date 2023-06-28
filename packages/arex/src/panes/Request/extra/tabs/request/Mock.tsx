import { SaveOutlined } from '@ant-design/icons';
import {tryParseJsonString, tryStringifyJson , EmptyWrapper, TooltipButton } from '@arextest/arex-core';
import { Editor } from '@monaco-editor/react';
import { useRequest } from 'ahooks';
import { App, Col, Collapse, Row, Space } from 'antd';
import React, { FC } from 'react';
import { useImmer } from 'use-immer';

import { StorageService } from '@/services';
import { MockTarget, RecordResult } from '@/services/StorageService';
import useUserProfile from '@/store/useUserProfile';

function convertData(data: MockTarget) {
  const { body, bodyParsed, ...rest } = data;
  return tryStringifyJson({ body: bodyParsed || body, ...rest }, undefined, true);
}

const Mock: FC<{ recordId: string }> = ({ recordId }) => {
  const { message } = App.useApp();
  const { theme } = useUserProfile();
  const [mockData, setMockData] = useImmer<RecordResult[]>([]);

  const { run: getMockData, loading } = useRequest(
    () =>
      StorageService.viewRecord({
        recordId,
        sourceProvider: 'Pinned',
      }),
    {
      onSuccess(res) {
        const stringifyData = res.map((result) => {
          result.targetRequest.bodyParsed = tryParseJsonString<Record<string, any>>(
            result.targetRequest.body,
          );

          result.targetResponse.bodyParsed = tryParseJsonString<Record<string, any>>(
            result.targetResponse.body,
          );

          return {
            ...result,
            targetRequestString: convertData(result.targetRequest),
            targetResponseString: convertData(result.targetResponse),
          };
        });

        setMockData(stringifyData);
      },
    },
  );

  const { run: updateMockData } = useRequest(StorageService.updateMockData, {
    manual: true,
    onSuccess() {
      // TODO
      message.success('Update successfully');
      getMockData();
    },
  });

  const handleSave = (id: string) => {
    const data = mockData.find((item) => item.id === id);
    if (!data) return;

    const { targetRequestString, targetResponseString, ...params } = data;

    params.targetRequest = tryParseJsonString(targetRequestString) as MockTarget;
    params.targetResponse = tryParseJsonString(targetResponseString) as MockTarget;

    typeof params.targetRequest.body !== 'string' &&
      (params.targetRequest.body = tryStringifyJson(params.targetRequest.body) as string);

    typeof params.targetResponse.body !== 'string' &&
      (params.targetResponse.body = tryStringifyJson(params.targetResponse.body) as string);

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
                      language={'json'}
                      height={'260px'}
                      theme={theme === Theme.dark ? 'vs-dark' : Theme.light}
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
                      value={mock.targetRequestString}
                      onChange={(value) => {
                        setMockData((state) => {
                          const data = state.find((item) => item.id === mock.id);
                          data && (data.targetRequestString = value);
                        });
                      }}
                    />
                  </Col>

                  <Col span={12}>
                    <Editor
                      language={'json'}
                      height={'260px'}
                      theme={theme === Theme.dark ? 'vs-dark' : Theme.light}
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
                      value={mock.targetResponseString}
                      onChange={(value) => {
                        setMockData((state) => {
                          const data = state.find((item) => item.id === mock.id);
                          data && (data.targetResponseString = value);
                        });
                      }}
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
