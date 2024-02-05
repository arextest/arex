import { BugOutlined } from '@ant-design/icons';
import {
  css,
  RequestMethodIcon,
  SpaceBetweenWrapper,
  TooltipButton,
  useTranslation,
} from '@arextest/arex-core';
import type { ArexEnvironment, ArexRESTResponse } from '@arextest/arex-request';
import {
  ArexResponse,
  getMarkFromToArr,
  REGEX_ENV_VAR,
  ResponseMeta,
  sendRequest,
  TestResult,
} from '@arextest/arex-request';
import { useRequest } from 'ahooks';
import { Card, Divider, Space, Spin, Typography } from 'antd';
import React, { FC, useMemo } from 'react';

import { CollectionNodeType, PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { FileSystemService } from '@/services';
import { useWorkspaces } from '@/store';

const { Text } = Typography;

export type BatchRunResultItemProps = {
  id: string;
  environment?: ArexEnvironment;
  data: Awaited<ReturnType<typeof FileSystemService.queryRequest>>;
  onResponse?: (data: ArexRESTResponse) => void;
};

function replaceBetween(string: string, start: number, end: number, what: string) {
  return string.substring(0, start) + what + string.substring(end);
}

const BatchRunResultItem: FC<BatchRunResultItemProps> = (props) => {
  const { method, name, endpoint } = props.data;
  const navPane = useNavPane();
  const { activeWorkspaceId } = useWorkspaces();

  const { t } = useTranslation('page');

  const realEndpoint = useMemo(() => {
    const parse = getMarkFromToArr(endpoint, REGEX_ENV_VAR, props.environment);
    let url = endpoint;
    if (parse.length) {
      parse.forEach((item) => {
        if (item.found) {
          url = replaceBetween(url, item.from, item.to, item.matchEnv.value);
        }
      });
    }
    return url;
  }, [endpoint, props.environment]);

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
        // marginLeft: props.caseType === CollectionNodeType.case ? '24px' : 0,
        padding: '0 16px',
      }}
    >
      <Divider style={{ margin: '8px 0' }} />

      <Card size={props.data.nodeType === CollectionNodeType.case ? 'small' : undefined}>
        <SpaceBetweenWrapper>
          <Space>
            {props.data.nodeType === CollectionNodeType.case && <RequestMethodIcon.case />}

            {React.createElement(RequestMethodIcon[method], {
              style: { display: 'flex', width: 'max-content' },
            })}
            <Text style={{ marginRight: '8px' }}>{name}</Text>
            <Text type='secondary'>{realEndpoint}</Text>
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
                    {t('batchRunPage.noTestScript')}
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
