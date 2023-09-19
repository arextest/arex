import { FullHeightSpin, RequestMethodIcon } from '@arextest/arex-core';
import { TestResult } from '@arextest/arex-request';
import { ArexRESTRequest } from '@arextest/arex-request/dist/components/http/data/rest';
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Divider, Space, Spin, Typography } from 'antd';
import React, { FC, useMemo } from 'react';

import { sendRequest } from '@/helpers/postman';
import { useEnvironments } from '@/store';

const { Text } = Typography;

export type BatchRunResultItemProps = {
  data: ArexRESTRequest;
};
const BatchRunResultItem: FC<BatchRunResultItemProps> = (props) => {
  const { method, name, endpoint } = props.data;

  const { activeEnvironment } = useEnvironments();
  const environment = useMemo(
    () => ({
      name: activeEnvironment?.envName || '',
      variables: activeEnvironment?.keyValues || [],
    }),
    [activeEnvironment],
  );

  const { data, loading } = useRequest(sendRequest, {
    defaultParams: [props.data, environment],
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

      <Divider
        css={css`
          margin: 0;
          margin-top: 10px;
        `}
      />
    </div>
  );
};

export default BatchRunResultItem;
