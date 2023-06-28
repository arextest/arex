import { tryPrettierJsonString, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Select, Space } from 'antd';
import React, { FC, useMemo, useState } from 'react';

import { Segmented } from '@/components';
import NodesIgnore from '@/panes/AppSetting/CompareConfig/NodesIgnore';
import NodeSort from '@/panes/AppSetting/CompareConfig/NodeSort';
import { ApplicationService, ConfigService } from '@/services';

import SyncResponse from './SyncResponse';

export enum CONFIG_TYPE {
  GLOBAL,
  INTERFACE,
  DEPENDENCY,
}

export type CompareConfigProps = {
  appId: string;
};

const CompareConfig: FC<CompareConfigProps> = (props) => {
  const { t } = useTranslation();
  const { message } = App.useApp();

  const configOptions = useMemo(
    () => [
      {
        label: 'Global',
        value: CONFIG_TYPE.GLOBAL,
      },
      {
        label: 'Interface',
        value: CONFIG_TYPE.INTERFACE,
      },
      {
        label: 'Dependency',
        value: CONFIG_TYPE.DEPENDENCY,
      },
    ],
    [],
  );
  const [configType, setConfigType] = useState<CONFIG_TYPE>(CONFIG_TYPE.GLOBAL);

  const [activeOperationId, setActiveOperationId] = useState<string | undefined>();
  const [rawResponse, setRawResponse] = useState<string>();

  /**
   * 请求 InterfacesList
   */
  const { data: operationList = [] } = useRequest(
    () => ApplicationService.queryInterfacesList<'Interface'>({ id: props.appId as string }),
    {
      ready: !!props.appId,
      onSuccess(res) {
        setActiveOperationId(res?.[0]?.id);
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
    <Space size='middle' direction='vertical' style={{ display: 'flex' }}>
      <Space style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Segmented
          value={configType}
          options={configOptions}
          onChange={(value) => setConfigType(value as CONFIG_TYPE)}
        />

        {configType !== CONFIG_TYPE.GLOBAL && (
          <Select
            showSearch
            optionFilterProp='label'
            placeholder='choose interface'
            popupMatchSelectWidth={false}
            options={operationList.map((operation) => ({
              label: operation.operationName,
              value: operation.id,
            }))}
            value={activeOperationId}
            onChange={setActiveOperationId}
          />
        )}

        {configType === CONFIG_TYPE.DEPENDENCY && (
          <Select
            allowClear
            showSearch
            optionFilterProp='label'
            placeholder='choose external dependency'
            popupMatchSelectWidth={false}
          />
        )}

        <SyncResponse value={rawResponse} onSave={handleSaveResponse} />
      </Space>

      <NodesIgnore
        appId={props.appId}
        configType={configType}
        operationId={activeOperationId}
        responseParsed={interfaceResponseParsed}
      />

      <NodeSort
        appId={props.appId}
        configType={configType}
        operationId={activeOperationId}
        responseParsed={interfaceResponseParsed}
      />
    </Space>
  );
};

export default CompareConfig;
