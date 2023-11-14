import { RequestMethodIcon } from '@arextest/arex-core';
import type { ArexEnvironment, ArexRESTRequest, ArexRESTResponse } from '@arextest/arex-request';
import { ArexResponse, ResponseMeta, sendRequest, TestResult } from '@arextest/arex-request';
import { ArexTestResult, ArexVisualizer } from '@arextest/arex-request/src';
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Card, Divider, Space, Spin, Typography } from 'antd';
import React, { FC } from 'react';

const { Text } = Typography;

export type BatchRunResultItemProps = {
  id: string;
  environment?: ArexEnvironment;
  data: ArexRESTRequest;
  onResponse?: (data: ArexRESTResponse) => void;
};
const BatchRunResultItem: FC<BatchRunResultItemProps> = (props) => {
  const { method, name, endpoint } = props.data;

  const { data, loading } = useRequest<ArexResponse, any>(
    () => sendRequest(props.data, props.environment),
    {
      refreshDeps: [props.data, props.environment],
      onSuccess: (res) => {
        props.onResponse?.(res);
      },
    },
  );

  return (
    <div id={props.id} style={{ padding: '0 16px' }}>
      <Divider style={{ margin: '8px 0' }} />

      <Card size='small'>
        <Space size='large'>
          {React.createElement(RequestMethodIcon[method])}
          <Text>{name}</Text>
          <Text type='secondary'>{endpoint}</Text>
        </Space>

        <ResponseMeta response={data?.response} />

        <div style={{ minHeight: '32px' }}>
          <Spin spinning={loading}>
            {!loading && (
              <div>
                {data?.testResult?.length ? (
                  <TestResult testResult={data.testResult} />
                ) : (
                  <Text
                    css={css`
                      display: block;
                      margin: 16px;
                    `}
                    type='secondary'
                  >
                    No tests found
                  </Text>
                )}
              </div>
            )}
          </Spin>
        </div>
      </Card>
    </div>
  );
};

export default BatchRunResultItem;
