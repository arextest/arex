import { RequestMethodIcon } from '@arextest/arex-core';
import type { ArexEnvironment, ArexRESTRequest } from '@arextest/arex-request';
import { ResponseMeta, sendRequest, TestResult } from '@arextest/arex-request';
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Divider, Space, Spin, Typography } from 'antd';
import React, { FC } from 'react';

const { Text } = Typography;

export type BatchRunResultItemProps = {
  environment?: ArexEnvironment;
  data: ArexRESTRequest;
};
const BatchRunResultItem: FC<BatchRunResultItemProps> = (props) => {
  const { method, name, endpoint } = props.data;

  const { data, loading } = useRequest(() => sendRequest(props.data, props.environment), {
    refreshDeps: [props.data, props.environment],
  });

  return (
    <div
      css={css`
        padding: 8px;
      `}
    >
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

      <Divider style={{ margin: 0, marginTop: '8px' }} />
    </div>
  );
};

export default BatchRunResultItem;
