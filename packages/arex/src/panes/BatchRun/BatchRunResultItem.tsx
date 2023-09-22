import { RequestMethodIcon } from '@arextest/arex-core';
import type { ArexRESTRequest } from '@arextest/arex-request';
import { sendRequest, TestResult } from '@arextest/arex-request';
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Divider, Space, Spin, Typography } from 'antd';
import React, { FC } from 'react';

const { Text } = Typography;

export type BatchRunResultItemProps = {
  data: ArexRESTRequest;
};
const BatchRunResultItem: FC<BatchRunResultItemProps> = (props) => {
  const { method, name, endpoint } = props.data;

  const { data, loading } = useRequest(sendRequest, {
    defaultParams: [
      props.data,
      { id: 'xxx', name: 'xxx', variables: [] }, //environment
    ],
  });

  return (
    <div
      css={css`
        padding: 8px;
      `}
    >
      <Space>
        {React.createElement(RequestMethodIcon[method])}
        <Text>{name}</Text>
        <Text type='secondary'>{endpoint}</Text>
      </Space>

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
