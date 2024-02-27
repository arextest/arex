import { BugOutlined } from '@ant-design/icons';
import {
  css,
  RequestMethodIcon,
  SpaceBetweenWrapper,
  TooltipButton,
  useTranslation,
} from '@arextest/arex-core';
import type { ArexEnvironment, ArexRESTRequest } from '@arextest/arex-request';
import {
  ArexResponse,
  getMarkFromToArr,
  REGEX_ENV_VAR,
  ResponseMeta,
  TestResult,
} from '@arextest/arex-request';
import { Card, Divider, Space, Typography } from 'antd';
import React, { FC, useMemo } from 'react';

import { CollectionNodeType, PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { useWorkspaces } from '@/store';

const { Text } = Typography;

export type BatchRunResultItemProps = {
  environment?: ArexEnvironment;
  request: ArexRESTRequest;
  response?: ArexResponse;
};

function replaceBetween(string: string, start: number, end: number, what: string) {
  return string.substring(0, start) + what + string.substring(end);
}

const BatchRunResultItem: FC<BatchRunResultItemProps> = (props) => {
  const { method, name, endpoint } = props.request;
  const navPane = useNavPane();
  const { activeWorkspaceId } = useWorkspaces();

  const { t } = useTranslation('page');

  const nodeType = useMemo(() => {
    const length = props.request.parentPath.length;
    const parent = props.request.parentPath[length - 1];
    return parent?.nodeType === CollectionNodeType.interface
      ? CollectionNodeType.case
      : CollectionNodeType.interface;
  }, [props.request]);

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

  const handleDebugCase = () => {
    navPane({
      type: PanesType.REQUEST,
      id: `${activeWorkspaceId}-${nodeType}-${props.request.id}`,
      name: `Debug-${props.request.name}`,
      icon: props.request.method,
    });
  };

  return (
    <div
      style={{
        padding: '0 16px',
      }}
    >
      <Divider style={{ margin: '8px 0' }} />

      <Card size='small'>
        <SpaceBetweenWrapper>
          <Space>
            {nodeType === CollectionNodeType.case && <RequestMethodIcon.case />}
            {React.createElement(RequestMethodIcon[method], {
              // @ts-ignore
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

        <ResponseMeta response={props.response?.response} />

        <div style={{ minHeight: '32px' }}>
          <div>
            {props.response?.testResult?.length ? (
              <TestResult testResult={props.response.testResult} />
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
        </div>
      </Card>
    </div>
  );
};

export default BatchRunResultItem;
