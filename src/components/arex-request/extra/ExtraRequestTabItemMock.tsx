import { SaveOutlined } from '@ant-design/icons';
import { json } from '@codemirror/lang-json';
import { useRequest } from 'ahooks';
import { App, Card, Col, Row, Space } from 'antd';
import React, { FC } from 'react';
import { useImmer } from 'use-immer';

import request from '../../../helpers/api/request';
import { tryParseJsonString, tryPrettierJsonString } from '../../../helpers/utils';
import useUserProfile from '../../../store/useUserProfile';
import { EmptyWrapper, WatermarkCodeMirror } from '../../styledComponents';
import TooltipButton from '../../TooltipButton';

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
  targetRequest: { [key: string]: any };
  targetRequestString?: string;
  targetResponse: { [key: string]: any };
  targetResponseString?: string;
  operationName: string;
};

const ExtraRequestTabItemMock: FC<{ recordId: string }> = ({ recordId }) => {
  const { message } = App.useApp();
  const { theme } = useUserProfile();
  const [mockData, setMockData] = useImmer<MockData[]>([]);

  const { run: getMockData, loading } = useRequest<MockData[], []>(
    () =>
      request
        .post<{ recordResult: MockData[] }>(`/storage/storage/replay/query/viewRecord`, {
          recordId,
          sourceProvider: 'Pinned',
        })
        .then((res) =>
          Promise.resolve(
            res.recordResult.map((result) => ({
              ...result,
              targetRequestString: tryPrettierJsonString(JSON.stringify(result.targetRequest)),
              targetResponseString: tryPrettierJsonString(JSON.stringify(result.targetResponse)),
            })),
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

    const { targetRequestString, targetResponseString, ...params } = data;
    params.targetRequest = tryParseJsonString(targetRequestString) || {};
    params.targetResponse = tryParseJsonString(targetResponseString) || {};

    updateMockData(params);
  };

  return (
    <Space direction='vertical' style={{ width: '100%' }}>
      <EmptyWrapper loading={loading} empty={!mockData.length}>
        {mockData.map((mock) => (
          <Card
            size='small'
            key={mock.id}
            title={mock.operationName}
            extra={
              <TooltipButton
                icon={<SaveOutlined />}
                title={'Save'}
                onClick={() => handleSave(mock.id)}
              />
            }
          >
            <Row gutter={16}>
              <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
                <WatermarkCodeMirror
                  remark='Request'
                  themeKey={theme}
                  extensions={[json()]}
                  value={mock.targetRequestString}
                  onChange={(value) =>
                    setMockData((state) => {
                      const data = state.find((item) => item.id === mock.id);
                      data && (data.targetRequestString = value);
                    })
                  }
                />
              </Col>
              <Col span={12}>
                <WatermarkCodeMirror
                  remark='Response'
                  themeKey={theme}
                  extensions={[json()]}
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
          </Card>
        ))}
      </EmptyWrapper>
    </Space>
  );
};

export default ExtraRequestTabItemMock;
