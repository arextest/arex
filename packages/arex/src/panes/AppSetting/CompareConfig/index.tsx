import { useRequest } from 'ahooks';
import { Divider, Select, Space, Typography } from 'antd';
import { Label, tryPrettierJsonString, useTranslation } from 'arex-core';
import React, { FC, useMemo, useState } from 'react';

import NodesIgnore from '@/panes/AppSetting/CompareConfig/NodesIgnore';
import { ApplicationService, ConfigService } from '@/services';

import SyncResponse from './SyncResponse';

export const GLOBAL_OPERATION_ID = '__global__';

export type CompareConfigProps = {
  appId: string;
};

const CompareConfig: FC<CompareConfigProps> = (props) => {
  const { t } = useTranslation();

  const [activeOperationId, setActiveOperationId] = useState<string | undefined>();
  const [rawResponse, setRawResponse] = useState<string>();

  /**
   * 请求 InterfacesList
   */
  const { data: operationList = [] } = useRequest(
    () => ApplicationService.queryInterfacesList<'Interface'>({ id: props.appId as string }),
    {
      ready: !!props.appId,
      onSuccess: (res) => {
        console.log(res);
      },
    },
  );

  /**
   * 请求 InterfaceResponse
   */
  const {
    data: interfaceResponse,
    mutate: setInterfaceResponse,
    run: queryInterfaceResponse,
    loading: loadingInterfaceResponse,
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
  ``;
  const interfaceResponseParsed = useMemo<{ [key: string]: any }>(() => {
    const res = interfaceResponse?.operationResponse;
    if (res) return JSON.parse(res) || {};
    else return {};
  }, [interfaceResponse]);

  const handleSaveResponse = (value?: string) => {
    console.log(value);
  };

  return (
    <>
      <div>
        <Typography.Text type='secondary'>appId: {props.appId}</Typography.Text>
      </div>

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

      <Divider />

      <NodesIgnore
        appId={props.appId}
        interfaceId={activeOperationId}
        responseParsed={interfaceResponseParsed}
      />
    </>
  );
};

export default CompareConfig;
