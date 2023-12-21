import { SaveOutlined } from '@ant-design/icons';
import {
  EmptyWrapper,
  TooltipButton,
  tryPrettierJsonString,
  useArexCoreConfig,
} from '@arextest/arex-core';
import { Editor } from '@monaco-editor/react';
import { useRequest } from 'ahooks';
import { App, Col, Collapse, Row, Space } from 'antd';
import axios from 'axios';
import { cloneDeep } from 'lodash';
import React, { FC } from 'react';
import { useImmer } from 'use-immer';

import { Theme } from '@/constant';
import request from '@/utils/request';

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
  targetResponse: MockTarget;
  operationName: string;
};

type MockDataParse = Omit<MockData, 'targetRequest' | 'targetResponse'> & {
  targetRequest: MockTargetParsed;
  targetResponse: MockTargetParsed;
};

const Mock: FC<{ recordId?: string }> = ({ recordId }) => {
  const { message } = App.useApp();
  const { theme } = useArexCoreConfig();
  const [mockData, setMockData] = useImmer<MockDataParse[]>([]);

  const { run: getMockData, loading } = useRequest<MockDataParse[], []>(
    () =>
      axios
        .post<{ recordResult: MockData[] }>(`/storage/storage/replay/query/viewRecord`, {
          recordId,
          sourceProvider: 'Pinned',
        })
        .then((res) => res.data.recordResult),
    {
      onSuccess(res) {
        res.map((item) => {
          item.targetRequest.body = tryPrettierJsonString(item.targetRequest.body || '');
          item.targetResponse.body = tryPrettierJsonString(item.targetResponse.body || '');
        });
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
    const params = cloneDeep(data);
    params.targetRequest.body = tryPrettierJsonString(params.targetRequest.body || '');
    params.targetResponse.body = tryPrettierJsonString(params.targetResponse.body || '');
    updateMockData(params);
  };

  return (
    <Space direction='vertical' style={{ width: '100%' }}>
      <EmptyWrapper loading={loading} empty={!mockData.length}>
        <Space direction='vertical' style={{ width: '100%' }}>
          <Collapse
            defaultActiveKey={mockData.map((mock) => mock.id)}
            items={mockData.map((mock) => ({
              key: mock.id,
              label: mock.operationName,
              extra: (
                <TooltipButton
                  title={'Save'}
                  icon={<SaveOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSave(mock.id);
                  }}
                />
              ),
              children: (
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
                      theme={theme === Theme.dark ? 'vs-dark' : 'light'}
                      height={'260px'}
                      value={mock.targetRequest.body || ''}
                      onChange={(value) => {
                        setMockData((state) => {
                          const data = state.find((item) => item.id === mock.id);
                          data && (data.targetRequest.body = value);
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
                      theme={theme === Theme.dark ? 'vs-dark' : 'light'}
                      height={'260px'}
                      value={mock.targetResponse.body || ''}
                      onChange={(value) => {
                        setMockData((state) => {
                          const data = state.find((item) => item.id === mock.id);
                          data && (data.targetResponse.body = value);
                        });
                      }}
                      language={'json'}
                    />
                  </Col>
                </Row>
              ),
            }))}
          />
        </Space>
      </EmptyWrapper>
    </Space>
  );
};
export default Mock;
