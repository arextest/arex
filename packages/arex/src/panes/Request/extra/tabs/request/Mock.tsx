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
import React, { FC } from 'react';

import { Theme } from '@/constant';
import { StorageService } from '@/services';
import { RecordResult } from '@/services/ReportService';

export interface MockProps {
  data: RecordResult[];
  loading?: boolean;
  readOnly?: boolean;
  onChange?: (data: RecordResult[]) => void;
  onRefresh?: () => void;
}

const Mock: FC<MockProps> = (props) => {
  const { message } = App.useApp();
  const { theme } = useArexCoreConfig();

  const { run: updateMockData } = useRequest(StorageService.updateRecord, {
    manual: true,
    onSuccess(success) {
      if (success) {
        message.success('Update successfully');
        props.onRefresh?.();
      }
    },
  });

  const handleSave = (id: string) => {
    const data = props.data.find((item) => item.id === id);
    if (!data) return;
    data.targetRequest.body = tryPrettierJsonString(data.targetRequest.body || '');
    data.targetResponse.body = tryPrettierJsonString(data.targetResponse.body || '');
    updateMockData(data);
  };

  return (
    <Space direction='vertical' style={{ width: '100%' }}>
      <EmptyWrapper loading={props.loading} empty={!props.data.length}>
        <Space direction='vertical' style={{ width: '100%' }}>
          <Collapse
            defaultActiveKey={props.data.map((mock) => mock.id)}
            items={props.data.map((mock) => ({
              key: mock.id,
              label: mock.operationName,
              extra: !props.readOnly && (
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
                        readOnly: props.readOnly,
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
                        const data = props.data.find((item) => item.id === mock.id);
                        data && (data.targetRequest.body = value || '');
                        props.onChange?.(props.data);
                      }}
                    />
                  </Col>
                  <Col span={12}>
                    <Editor
                      height='240px'
                      language='json'
                      theme={theme === Theme.dark ? 'vs-dark' : 'light'}
                      options={{
                        readOnly: props.readOnly,
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
                        const data = props.data.find((item) => item.id === mock.id);
                        data && (data.targetResponse.body = value || '');
                        props.onChange?.(props.data);
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
