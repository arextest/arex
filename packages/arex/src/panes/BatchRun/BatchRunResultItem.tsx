import { BugOutlined } from '@ant-design/icons';
import { css, RequestMethodIcon, SpaceBetweenWrapper, TooltipButton } from '@arextest/arex-core';
import type { ArexEnvironment, ArexRESTRequest, ArexRESTResponse } from '@arextest/arex-request';
import { ArexResponse, ResponseMeta, sendRequest, TestResult } from '@arextest/arex-request';
import { useRequest } from 'ahooks';
import { Card, Divider, Space, Spin, Typography } from 'antd';
import React, { createElement, FC } from 'react';

import { CollectionNodeType, PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { useWorkspaces } from '@/store';

const { Text } = Typography;

export type BatchRunResultItemProps = {
  id: string;
  environment?: ArexEnvironment;
  data: ArexRESTRequest;
  caseType: CollectionNodeType;
  onResponse?: (data: ArexRESTResponse) => void;
};
const BatchRunResultItem: FC<BatchRunResultItemProps> = (props) => {
  const { method, name, endpoint } = props.data;
  const navPane = useNavPane();
  const { activeWorkspaceId } = useWorkspaces();

  const { data, loading } = useRequest<ArexResponse, any>(
    () => sendRequest(props.data, props.environment),
    {
      refreshDeps: [props.data, props.environment],
      onSuccess: (res) => {
        props.onResponse?.(res);
      },
    },
  );

  const handleDebugCase = () => {
    navPane({
      type: PanesType.REQUEST,
      id: `${activeWorkspaceId}-${CollectionNodeType.case}-${props.data.id}`,
      name: `Debug-${props.data.name}`,
      icon: props.data.method,
    });
  };

  return (
    <div
      id={props.id}
      style={{
        marginLeft: props.caseType === CollectionNodeType.case ? '24px' : 0,
        padding: '0 16px',
      }}
    >
      {createElement(props.caseType === CollectionNodeType.case ? 'div' : Divider, {
        style: { margin: '8px 0' },
      })}

      <Card size={props.caseType === CollectionNodeType.case ? 'small' : undefined}>
        <SpaceBetweenWrapper>
          <Space>
            {React.createElement(RequestMethodIcon[method], {
              style: { display: 'flex', width: 'max-content' },
            })}
            <Text style={{ marginRight: '8px' }}>{name}</Text>
            <Text type='secondary'>{endpoint}</Text>
          </Space>
          <TooltipButton
            title='Debug'
            size='small'
            type='text'
            color='primary'
            icon={<BugOutlined />}
            onClick={handleDebugCase}
          />
        </SpaceBetweenWrapper>

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
