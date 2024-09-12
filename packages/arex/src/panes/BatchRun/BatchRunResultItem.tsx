import { BugOutlined } from '@ant-design/icons';
import {
  css,
  RequestMethodIcon,
  Segmented,
  SpaceBetweenWrapper,
  Theme,
  TooltipButton,
  tryParseJsonString,
  tryStringifyJson,
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
import { Editor } from '@monaco-editor/react';
import { Allotment } from 'allotment';
import { Card, Divider, Space, Typography } from 'antd';
import React, { FC, useMemo, useState } from 'react';

import { CollectionNodeType, PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import EditableKeyValueTable, {
  useColumns,
} from '@/panes/Request/EnvironmentDrawer/EditableKeyValueTable';
import { useUserProfile, useWorkspaces } from '@/store';

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

  const { theme } = useUserProfile();
  const { activeWorkspaceId } = useWorkspaces();

  const { t } = useTranslation('page');

  const [requestSegmentValue, setRequestSegmentValue] = useState('body');
  const [responseSegmentValue, setResponseSegmentValue] = useState('body');

  const columns = useColumns(undefined, false);

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
            {/*{nodeType === CollectionNodeType.case && <RequestMethodIcon.case />}*/}
            {React.createElement(RequestMethodIcon[method], {
              // @ts-ignore
              style: { display: 'flex', width: 'max-content' },
            })}
            <Text style={{ marginRight: '8px' }}>{name}</Text>
            <Text type='secondary'>{realEndpoint}</Text>
          </Space>
          <TooltipButton
            title={t('components:replay.debug')}
            size='small'
            type='text'
            color='primary'
            icon={<BugOutlined />}
            onClick={handleDebugCase}
          />
        </SpaceBetweenWrapper>

        <ResponseMeta response={props.response?.response} />

        <Divider style={{ margin: '8px 0' }} />

        <Allotment css={{ height: '400px' }}>
          <Allotment.Pane minSize={220}>
            <div style={{ padding: '0 8px 8px 0' }}>
              <div style={{ marginBottom: '4px' }}>
                <Typography.Title level={5} style={{ display: 'inline', marginRight: '8px' }}>
                  {t('common:request')}
                </Typography.Title>
                <Segmented
                  value={requestSegmentValue}
                  options={['body', 'header']}
                  onChange={(value) => setRequestSegmentValue(value.toString())}
                />
              </div>

              {requestSegmentValue === 'body' ? (
                <Editor
                  height={368}
                  language='json'
                  theme={theme === Theme.dark ? 'vs-dark' : 'light'}
                  options={{
                    minimap: {
                      enabled: false,
                    },
                    contextmenu: false,
                  }}
                  value={
                    props.request.body.body
                      ? tryStringifyJson(tryParseJsonString(props.request.body.body), {
                          prettier: true,
                        })
                      : ''
                  }
                />
              ) : (
                <div style={{ height: '368px', overflowY: 'auto' }}>
                  <EditableKeyValueTable
                    showHeader
                    pagination={false}
                    dataSource={props.request.headers}
                    columns={columns as any}
                  />
                </div>
              )}
            </div>
          </Allotment.Pane>

          <Allotment.Pane minSize={220}>
            <div style={{ padding: '0 0 8px 12px' }}>
              <div style={{ marginBottom: '4px' }}>
                <Typography.Title level={5} style={{ display: 'inline', marginRight: '8px' }}>
                  {t('common:response')}
                </Typography.Title>
                <Segmented
                  value={responseSegmentValue}
                  options={['body', 'header']}
                  onChange={(value) => setResponseSegmentValue(value.toString())}
                />
              </div>
              {responseSegmentValue === 'body' ? (
                <Editor
                  height={368}
                  language='json'
                  theme={theme === Theme.dark ? 'vs-dark' : 'light'}
                  options={{
                    minimap: {
                      enabled: false,
                    },
                    contextmenu: false,
                  }}
                  value={
                    props.response?.response?.body
                      ? tryStringifyJson(tryParseJsonString(props.response.response.body), {
                          prettier: true,
                        })
                      : ''
                  }
                />
              ) : (
                <div style={{ height: '368px', overflowY: 'auto' }}>
                  <EditableKeyValueTable
                    showHeader
                    pagination={false}
                    // @ts-ignore
                    dataSource={props.response?.response?.headers}
                    columns={columns as any}
                  />
                </div>
              )}
            </div>
          </Allotment.Pane>
        </Allotment>

        <Divider style={{ margin: '8px 0' }} />

        <div style={{ padding: '8px 0', minHeight: '32px' }}>
          <Typography.Title level={5} style={{ display: 'inline' }}>
            {t('components:http.test')}
          </Typography.Title>
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
