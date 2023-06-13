import { useRequest } from 'ahooks';
import { App, Divider, Select, Space } from 'antd';
import { Label, tryPrettierJsonString, useTranslation } from 'arex-core';
import React, { FC, useMemo, useState } from 'react';

import NodesIgnore from '@/panes/AppSetting/CompareConfig/NodesIgnore';
import NodeSort from '@/panes/AppSetting/CompareConfig/NodeSort';
import { ApplicationService, ConfigService } from '@/services';

import SyncResponse from './SyncResponse';

export const GLOBAL_OPERATION_ID = '__global__';

export type CompareConfigProps = {
  appId: string;
};

const CompareConfig: FC<CompareConfigProps> = (props) => {
  const { t } = useTranslation();
  const { message } = App.useApp();

  const [activeOperationId, setActiveOperationId] = useState<string | undefined>();
  const [rawResponse, setRawResponse] = useState<string>();

  /**
   * 请求 InterfacesList
   */
  const { data: operationList = [] } = useRequest(
    () => ApplicationService.queryInterfacesList<'Interface'>({ id: props.appId as string }),
    {
      ready: !!props.appId,
    },
  );

  /**
   * 请求 InterfaceResponse
   */
  const {
    data: interfaceResponse,
    mutate: setInterfaceResponse,
    run: queryInterfaceResponse,
  } = useRequest(
    () =>
      ConfigService.queryInterfaceResponse({
        id: activeOperationId as string,
      }),
    {
      ready: !!activeOperationId,
      refreshDeps: [activeOperationId],
      onBefore() {
        setInterfaceResponse();
      },
      onSuccess(res) {
        setRawResponse(tryPrettierJsonString(res?.operationResponse || ''));
      },
    },
  );

  const interfaceResponseParsed = useMemo<{ [key: string]: any }>(() => {
    const res = interfaceResponse?.operationResponse;
    if (res) return JSON.parse(res) || {};
    else return {};
  }, [interfaceResponse]);

  /**
   * 更新 InterfaceResponse
   */
  const { run: updateInterfaceResponse } = useRequest(ConfigService.updateInterfaceResponse, {
    manual: true,
    onSuccess(success) {
      if (success) {
        queryInterfaceResponse();
        message.success(t('message.updateSuccess', { ns: 'common' }));
      } else {
        message.error(t('message.updateFailed', { ns: 'common' }));
      }
    },
  });

  const handleSaveResponse = (value?: string) => {
    activeOperationId &&
      updateInterfaceResponse({
        id: activeOperationId as string,
        operationResponse: value,
      });
  };

  return (
    <>
      <Space>
        <div>
          <Label>operationName</Label>
          <Select
            allowClear
            placeholder='global'
            options={operationList.map((operation) => ({
              label: operation.operationName,
              value: operation.id,
            }))}
            value={activeOperationId}
            onChange={setActiveOperationId}
            style={{ width: '300px' }}
          />
        </div>

        <SyncResponse value={rawResponse} onSave={handleSaveResponse} />
      </Space>

      <Divider style={{ margin: '16px 0 8px 0' }} />

      <NodesIgnore
        appId={props.appId}
        interfaceId={activeOperationId}
        responseParsed={interfaceResponseParsed}
      />

      <Divider style={{ margin: '16px 0 8px 0' }} />

      <NodeSort
        appId={props.appId}
        interfaceId={activeOperationId}
        responseParsed={interfaceResponseParsed}
      />
    </>
  );
};

export default CompareConfig;
