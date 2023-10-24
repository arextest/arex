import {
  Segmented,
  tryParseJsonString,
  tryPrettierJsonString,
  useTranslation,
} from '@arextest/arex-core';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useRequest } from 'ahooks';
import { App, Space } from 'antd';
import React, { FC, useCallback, useMemo, useRef, useState } from 'react';

import {
  CONFIG_TARGET,
  GlobalInterfaceDependencySelect,
  GlobalInterfaceDependencySelectProps,
  GlobalInterfaceDependencySelectRef,
} from '@/components';
import { ReportService } from '@/services';
import { DependencyParams } from '@/services/ComparisonService';

import CategoryIgnore from './CategoryIgnore';
import NodesIgnore from './NodesIgnore';
import NodesSort from './NodesSort';
import SyncContract from './SyncContract';

export enum CONFIG_TYPE {
  NODE_IGNORE,
  NODE_SORT,
  // NODE_Desensitization, // TODO
  CATEGORY_IGNORE,
}

export interface CompareConfigProps extends GlobalInterfaceDependencySelectProps {
  readOnly?: boolean; // 只读模式，用于展示接口的对比配置
  sortArrayPath?: string[]; // 指定数组节点排序配置的数组节点路径
  onIgnoreDrawerClose?: () => void;
  onSortDrawerClose?: () => void;
}

const CompareConfig: FC<CompareConfigProps> = (props) => {
  const { t } = useTranslation('components');
  const { message } = App.useApp();
  const [configAnimateParent] = useAutoAnimate();

  const [targetValue, setTargetValue] = useState<CONFIG_TARGET>(CONFIG_TARGET.INTERFACE);
  const [activeOperationId, setActiveOperationId] = useState<string | undefined>(
    props.operationId || undefined,
  );
  const [activeDependency, setActiveDependency] = useState<DependencyParams | undefined>(
    props.dependency,
  );

  const globalInterfaceDependencySelectRef = useRef<GlobalInterfaceDependencySelectRef>(null);

  const [typeValue, setTypeValue] = useState<CONFIG_TYPE>(
    props.sortArrayPath ? CONFIG_TYPE.NODE_SORT : CONFIG_TYPE.NODE_IGNORE,
  );

  const configTypeOptions = useMemo(() => {
    const options = [
      {
        label: t('appSetting.nodesIgnore'),
        value: CONFIG_TYPE.NODE_IGNORE,
      },
    ];

    if (targetValue !== CONFIG_TARGET.GLOBAL) {
      options.push(
        {
          label: t('appSetting.nodesSort'),
          value: CONFIG_TYPE.NODE_SORT,
        },
        // {
        //   label: t('appSetting.nodesDesensitization'),
        //   value: CONFIG_TYPE.NODE_Desensitization,
        // },
      );
    }

    if (targetValue !== CONFIG_TARGET.DEPENDENCY) {
      options.push({
        label: t('appSetting.categoryIgnore'),
        value: CONFIG_TYPE.CATEGORY_IGNORE,
      });
    }

    return options;
  }, [t, targetValue]);

  const [rawContract, setRawContract] = useState<string>();

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
          globalInterfaceDependencySelectRef.current?.setDependencyOptions(
            data.dependencyList.map((dependency) => ({
              label: dependency.operationType + '-' + dependency.operationName,
              value: dependency.operationType + '-' + dependency.operationName,
            })),
          );
        }
      },
    },
  );

  /**
   * 请求 Contract
   */
  const {
    data: contract,
    mutate: setContract,
    loading: loadingContract,
    run: queryContract,
  } = useRequest(
    () =>
      ReportService.queryContract({
        appId: props.appId,
        operationId: activeOperationId,
        ...(targetValue === CONFIG_TARGET.DEPENDENCY ? activeDependency : {}),
      }),
    {
      ready: !!props.appId && !syncing,
      refreshDeps: [props.sortArrayPath, targetValue, syncing], // TODO 目前可能有一些多余的无效请求，待优化
      onBefore() {
        setContract();
        setRawContract(undefined);
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

  const handleSaveContract = (value?: string) => {
    let params = {
      appId: props.appId,
      operationResponse: value || '',
    };
    if (targetValue === CONFIG_TARGET.INTERFACE) {
      params = Object.assign(params, {
        operationId: activeOperationId,
      });
    }
    if (targetValue === CONFIG_TARGET.DEPENDENCY && activeDependency) {
      params = Object.assign(params, {
        operationId: activeOperationId,
        operationType: activeDependency.operationType,
        operationName: activeDependency.operationName,
      });
    }

    updateContract(params);
  };

  const handleTargetChange = (target: CONFIG_TARGET) => {
    setTargetValue(target);
    setTypeValue((value) =>
      targetValue === CONFIG_TARGET.GLOBAL && typeValue === CONFIG_TYPE.NODE_SORT
        ? CONFIG_TYPE.NODE_IGNORE // sortNode has no global configuration types
        : value,
    );
  };

  const handleConfigTypeChange = useCallback(
    (value: React.Key) => setTypeValue(value as CONFIG_TYPE),
    [],
  );

  return (
    <Space size='middle' direction='vertical' style={{ display: 'flex' }}>
      <Space size='middle'>
        <GlobalInterfaceDependencySelect
          ref={globalInterfaceDependencySelectRef}
          appId={props.appId}
          operationId={props.operationId}
          dependency={props.dependency}
          onTargetChange={handleTargetChange}
          onOperationChange={setActiveOperationId}
          onDependencyChange={setActiveDependency}
        />

        <div>
          <br />
          <SyncContract
            syncing={syncing}
            value={rawContract}
            buttonsDisabled={{ leftButton: syncing || targetValue === CONFIG_TARGET.GLOBAL }}
            onSync={handleSync}
            onEdit={queryContract}
            onSave={handleSaveContract}
          />
        </div>
      </Space>

      <Segmented value={typeValue} options={configTypeOptions} onChange={handleConfigTypeChange} />

      <div ref={configAnimateParent}>
        {typeValue === CONFIG_TYPE.NODE_IGNORE && (
          <NodesIgnore
            key='nodes-ignore'
            appId={props.appId}
            operationId={activeOperationId}
            dependency={activeDependency}
            readOnly={props.readOnly}
            syncing={syncing}
            loadingContract={loadingContract}
            configTarget={targetValue}
            contractParsed={contractParsed}
            onAdd={queryContract}
            onSync={handleSync}
            onClose={props.onIgnoreDrawerClose}
          />
        )}

        {typeValue === CONFIG_TYPE.NODE_SORT && (
          <NodesSort
            key='nodes-sort'
            appId={props.appId}
            operationId={activeOperationId}
            dependency={activeDependency}
            readOnly={props.readOnly}
            syncing={syncing}
            sortArrayPath={props.sortArrayPath}
            loadingContract={loadingContract}
            configTarget={targetValue}
            contractParsed={contractParsed}
            onAdd={queryContract}
            onSync={handleSync}
            onClose={props.onSortDrawerClose}
          />
        )}

        {/*{configTypeValue === CONFIG_TYPE.NODE_Desensitization && (*/}
        {/*  <NodeDesensitization*/}
        {/*    key='nodes-desensitization'*/}
        {/*    appId={props.appId}*/}
        {/*    configTarget={configTargetValue}*/}
        {/*    operationId={activeOperationId}*/}
        {/*    dependency={activeDependency}*/}
        {/*    loadingContract={loadingContract}*/}
        {/*    contractParsed={contractParsed}*/}
        {/*    onAdd={queryContract}*/}
        {/*  />*/}
        {/*)}*/}

        {typeValue === CONFIG_TYPE.CATEGORY_IGNORE && (
          <CategoryIgnore
            key='category-ignore'
            appId={props.appId}
            operationId={activeOperationId}
            configTarget={targetValue}
          />
        )}
      </div>
    </Space>
  );
};

export default CompareConfig;
