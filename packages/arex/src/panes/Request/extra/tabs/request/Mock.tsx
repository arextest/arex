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
import { cloneDeep } from 'lodash';
import React, { FC } from 'react';
import { useImmer } from 'use-immer';

import { Theme } from '@/constant';
import { StorageService } from '@/services';
import { RecordResult } from '@/services/ReportService';

const Mock: FC<{ recordId?: string }> = ({ recordId }) => {
  const { message } = App.useApp();
  const { theme } = useArexCoreConfig();
  const [mockData, setMockData] = useImmer<RecordResult[]>([]);

  const { refresh: getMockData, loading } = useRequest(StorageService.queryRecord, {
    defaultParams: [recordId!],
    ready: !!recordId,
    onSuccess(res) {
      res.map((item) => {
        item.targetRequest.body = tryPrettierJsonString(item.targetRequest.body || '');
        item.targetResponse.body = tryPrettierJsonString(item.targetResponse.body || '');
      });
      setMockData(res);
    },
  });

  const { run: updateMockData } = useRequest(StorageService.updateRecord, {
    manual: true,
    onSuccess(success) {
      if (success) {
        message.success('Update successfully');
        getMockData();
      }
    },
  });

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
                      language='json'
                      height='240px'
                      theme={theme === Theme.dark ? 'vs-dark' : 'light'}
                      options={{
                        minimap: {
                          enabled: false,
                        },
                        fontSize: 12,
                        wordWrap: 'wordWrapColumn',
                        automaticLayout: true,
                        scrollBeyondLastLine: false,
                      }}
                      value={mock.targetRequest.body || ''}
                      onChange={(value) => {
                        setMockData((state) => {
                          const data = state.find((item) => item.id === mock.id);
                          data && (data.targetRequest.body = value || '');
                        });
                      }}
                    />
                  </Col>
                  <Col span={12}>
                    <Editor
                      height='240px'
                      language='json'
                      theme={theme === Theme.dark ? 'vs-dark' : 'light'}
                      options={{
                        minimap: {
                          enabled: false,
                        },
                        fontSize: 12,
                        wordWrap: 'wordWrapColumn',
                        automaticLayout: true,
                        scrollBeyondLastLine: false,
                      }}
                      value={mock.targetResponse.body || ''}
                      onChange={(value) => {
                        setMockData((state) => {
                          const data = state.find((item) => item.id === mock.id);
                          data && (data.targetResponse.body = value || '');
                        });
                      }}
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
