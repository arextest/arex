import { tryParseJsonString, tryPrettierJsonString, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Select, SelectProps, Space, Typography } from 'antd';
import React, { FC, useMemo, useState } from 'react';

import { Segmented } from '@/components';
import NodesIgnore from '@/panes/AppSetting/CompareConfig/NodesIgnore';
import NodeSort from '@/panes/AppSetting/CompareConfig/NodeSort';
import { ApplicationService, ReportService } from '@/services';

import SyncContract from './SyncContract';

export enum CONFIG_TYPE {
  GLOBAL,
  INTERFACE,
  DEPENDENCY,
}

export type CompareConfigProps = {
  appId: string; // 限定应用，用于展示特定应用下所有接口的对比配置
  operationId?: string; // 限定接口，用于展示特定接口的对比配置
  dependencyId?: string; // 限定依赖，用于展示特定依赖的对比配置
  readOnly?: boolean; // 只读模式，用于展示接口的对比配置
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

  const [activeOperationId, setActiveOperationId] = useState<string | undefined>(props.operationId);
  const [activeDependencyId, setActiveDependencyId] = useState<string | undefined>(
    props.dependencyId,
  );

  const [rawContract, setRawContract] = useState<string>();

  /**
   * 请求 InterfacesList
   */
  const { data: operationList = [] } = useRequest(
    () => ApplicationService.queryInterfacesList<'Interface'>({ id: props.appId as string }),
    {
      ready: !!props.appId,
      onSuccess(res) {
        !props.operationId && setActiveOperationId(res?.[0]?.id);
      },
    },
  );
  const interfaceOptions = useMemo(
    () =>
      operationList.map((operation) => ({
        label: operation.operationName,
        value: operation.id,
      })),
    [operationList],
  );

  /**
   * 请求 DependencyList
   */
  const { loading: loadingDependency } = useRequest(
    () => ApplicationService.getDependencyList({ operationId: activeOperationId as string }),
    {
      ready: !!activeOperationId,
      refreshDeps: [activeOperationId],
      onSuccess(res) {
        setActiveDependencyId(res?.[0]?.dependencyId);
        setDependencyOptions(
          res.map((dependency) => ({
            label: dependency.dependencyType + '-' + dependency.dependencyName,
            value: dependency.dependencyId,
          })),
        );
      },
    },
  );

  const [dependencyOptions, setDependencyOptions] = useState<SelectProps['options']>();

  /**
   * 请求 Contract
   */
  const {
    data: contract,
    mutate: setContract,
    run: queryContract,
  } = useRequest(
    () =>
      ReportService.queryContract({
        appId: configType === CONFIG_TYPE.GLOBAL ? props.appId : undefined,
        operationId: configType === CONFIG_TYPE.INTERFACE ? activeOperationId : undefined,
        contractId: configType === CONFIG_TYPE.DEPENDENCY ? activeDependencyId : undefined,
      }),
    {
      manual: true,
      onBefore() {
        setContract();
      },
      onSuccess(res) {
        setRawContract(tryPrettierJsonString(res?.contract || ''));
      },
    },
  );

  const contractParsed = useMemo<{ [key: string]: any }>(() => {
    const res = contract?.contract;
    if (res) return tryParseJsonString(res) || {};
    else return {};
  }, [contract]);

  /**
   * 更新 Contract
   */
  const { run: updateContract } = useRequest(ReportService.overwriteContract, {
    manual: true,
    onSuccess(success) {
      if (success) {
        message.success(t('message.updateSuccess', { ns: 'common' }));
      } else {
        message.error(t('message.updateFailed', { ns: 'common' }));
      }
    },
  });

  const { run: handleSync, loading: syncing } = useRequest(
    () =>
      ReportService.syncResponseContract({
        operationId: activeOperationId as string,
      }),
    {
      manual: true,
      ready: !!activeOperationId,
      onSuccess: (data) => {
        if (data?.dependencyList) {
          setDependencyOptions(
            data.dependencyList.map((dependency) => ({
              label: dependency.dependencyType + '-' + dependency.dependencyName,
              value: dependency.dependencyId,
            })),
          );
        }
      },
    },
  );

  const handleSaveContract = (value?: string) => {
    updateContract({
      operationId: configType === CONFIG_TYPE.INTERFACE ? activeOperationId : undefined,
      contractId: configType === CONFIG_TYPE.DEPENDENCY ? activeDependencyId : undefined,
      operationResponse: value || '',
    });
  };

  return (
    <Space size='middle' direction='vertical' style={{ display: 'flex' }}>
      <Space style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div>
          <div>
            <Typography.Text type='secondary'>Type : </Typography.Text>
          </div>
          <Segmented
            value={configType}
            options={configOptions}
            onChange={(value) => setConfigType(value as CONFIG_TYPE)}
          />
        </div>

        {configType !== CONFIG_TYPE.GLOBAL && (
          <div>
            <div>
              <Typography.Text type='secondary'>Interface :</Typography.Text>
            </div>
            <Select
              optionFilterProp='label'
              placeholder='choose interface'
              popupMatchSelectWidth={false}
              // START 指定 operationId 时，Select 只读
              showSearch={!props.operationId}
              bordered={!props.operationId}
              showArrow={!props.operationId}
              open={props.operationId ? false : undefined}
              // END 指定 operationId 时，Select 只读
              options={interfaceOptions}
              value={activeOperationId}
              onChange={setActiveOperationId}
              style={{ width: '160px' }}
            />
          </div>
        )}

        {configType === CONFIG_TYPE.DEPENDENCY && (
          <div>
            <div>
              <Typography.Text type='secondary'>Dependency : </Typography.Text>
            </div>
            <Select
              optionFilterProp='label'
              placeholder='choose external dependency'
              popupMatchSelectWidth={false}
              // START 指定 operationId 时，Select 只读
              showSearch={!props.dependencyId}
              bordered={!props.dependencyId}
              showArrow={!props.dependencyId}
              open={props.dependencyId ? false : undefined}
              // END 指定 operationId 时，Select 只读
              loading={loadingDependency}
              options={dependencyOptions}
              value={activeDependencyId}
              onChange={setActiveDependencyId}
              style={{ width: '160px' }}
            />
          </div>
        )}

        <div>
          <br />
          <SyncContract
            syncing={syncing}
            value={rawContract}
            buttonsDisabled={{ leftButton: syncing || configType === CONFIG_TYPE.GLOBAL }}
            onSync={handleSync}
            onEdit={queryContract}
            onSave={handleSaveContract}
          />
        </div>
      </Space>

      <NodesIgnore
        appId={props.appId}
        readOnly={props.readOnly}
        configType={configType}
        operationId={activeOperationId}
        dependencyId={activeDependencyId}
        contractParsed={contractParsed}
        onAdd={queryContract}
      />

      <NodeSort
        appId={props.appId}
        readOnly={props.readOnly}
        configType={configType}
        operationId={activeOperationId}
        dependencyId={activeDependencyId}
        contractParsed={contractParsed}
        onAdd={queryContract}
      />
    </Space>
  );
};

export default CompareConfig;
