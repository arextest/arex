import { SaveOutlined } from '@ant-design/icons';
import { json } from '@codemirror/lang-json';
import { useRequest } from 'ahooks';
import { Alert, App, Card, Col, Collapse, Row, Space } from 'antd';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useImmer } from 'use-immer';

import request from '../../../../../helpers/api/request';
import { tryParseJsonString, tryPrettierJsonString } from '../../../../../helpers/utils';
import useUserProfile from '../../../../../store/useUserProfile';
import { EmptyWrapper, WatermarkCodeMirror } from '../../../../styledComponents';
import TooltipButton from '../../../../TooltipButton';

type MockTarget = {
  body: string | null;
  attributes: Record<string, any> | null;
  type: string | null;
};

type MockTargetParsed = { body: Record<string, any> | string | null } & Omit<MockTarget, 'body'>;

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
  const { t } = useTranslation(['components', 'common']);

  const { run: getMockData, loading } = useRequest<MockDataParse[], []>(
    () =>
      request
        .post<{ recordResult: MockData[] }>(`/storage/storage/replay/query/viewRecord`, {
          recordId,
          sourceProvider: 'Pinned',
        })
        .then((res) =>
          Promise.resolve(
            res.recordResult.map((result) => {
              try {
                result.targetRequest.body &&
                  (result.targetRequest.body = JSON.parse(result.targetRequest.body));
              } catch (e) {
                console.info(e);
              }
              try {
                result.targetResponse.body &&
                  (result.targetResponse.body = JSON.parse(result.targetResponse.body));
              } catch (e) {
                console.info(e);
              }

              return {
                ...result,
                targetRequestString: tryPrettierJsonString(JSON.stringify(result.targetRequest)),
                targetResponseString: tryPrettierJsonString(JSON.stringify(result.targetResponse)),
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

    const { targetRequestString, targetResponseString, ...params } = data;

    params.targetRequest = tryParseJsonString(targetRequestString) as MockTarget;
    params.targetResponse = tryParseJsonString(targetResponseString) as MockTarget;

    typeof params.targetRequest.body !== 'string' &&
      (params.targetRequest.body = JSON.stringify(params.targetRequest.body));
    typeof params.targetResponse.body !== 'string' &&
      (params.targetResponse.body = JSON.stringify(params.targetResponse.body));

    updateMockData(params);
  };

  return (
    <Space direction='vertical' style={{ width: '100%' }}>
      <EmptyWrapper loading={loading} empty={!mockData.length}>
        <Space direction='vertical' style={{ width: '100%' }}>
          {/*<Alert message={t('appSetting.mockTips')} type='info' showIcon />*/}
          <Collapse defaultActiveKey={mockData.map((mock) => mock.id)}>
            {mockData.map((mock) => (
              <Collapse.Panel
                key={mock.id}
                header={mock.operationName}
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
              </Collapse.Panel>
            ))}
          </Collapse>
        </Space>
      </EmptyWrapper>
    </Space>
  );
};

export default Mock;
