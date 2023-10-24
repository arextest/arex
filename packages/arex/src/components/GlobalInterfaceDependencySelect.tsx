import { Label, Segmented, useTranslation } from '@arextest/arex-core';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useRequest } from 'ahooks';
import { Select, SelectProps, Space, Typography } from 'antd';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';

import { ApplicationService } from '@/services';
import { DependencyParams } from '@/services/ComparisonService';

export enum CONFIG_TARGET {
  GLOBAL,
  INTERFACE,
  DEPENDENCY,
}

export interface GlobalInterfaceDependencySelectRef {
  setDependencyOptions: (options: SelectProps['options']) => void;
}

export interface GlobalInterfaceDependencySelectProps {
  appId: string; // 限定应用，用于展示特定应用下所有接口的对比配置
  operationId?: string | false; // 限定接口，用于展示特定接口的对比配置, false 时不展示 operationType
  dependency?: DependencyParams; // 限定依赖，用于展示特定依赖的对比配置, undefined 时展示所有 dependency 选项, false 时不展示 dependency 选项
  onTargetChange?: (target: CONFIG_TARGET) => void;
  onOperationChange?: (operationId: string) => void;
  onDependencyChange?: (dependency: DependencyParams) => void;
}

const GlobalInterfaceDependencySelect = forwardRef<
  GlobalInterfaceDependencySelectRef,
  GlobalInterfaceDependencySelectProps
>((props, ref) => {
  const { t } = useTranslation('components');
  const [menuAnimateParent] = useAutoAnimate();

  const [targetValue, setTargetValue] = useState(CONFIG_TARGET.INTERFACE);
  const [operationValue, setOperationValue] = useState<string>();
  const [dependencyValue, setDependencyValue] = useState<DependencyParams | undefined>(
    props.dependency,
  );
  const dependencyKey = useMemo(
    () =>
      dependencyValue && (dependencyValue.operationType || dependencyValue.operationName)
        ? dependencyValue.operationType + '-' + dependencyValue.operationName //TODO null
        : undefined,
    [dependencyValue],
  );

  // 当组件初始化时，根据 props.operationId 和 props.dependencyId 设置 configType
  useEffect(() => {
    if (props.dependency) {
      setTargetValue(CONFIG_TARGET.DEPENDENCY);
      props.onTargetChange?.(CONFIG_TARGET.DEPENDENCY);

      setDependencyValue(props.dependency);
      props.onDependencyChange?.(props.dependency);
    } else if (props.operationId) {
      setTargetValue(CONFIG_TARGET.INTERFACE);
      props.onTargetChange?.(CONFIG_TARGET.INTERFACE);
    }
  }, [props.operationId, props.dependency]);

  const targetOptions = useMemo(() => {
    const options = [
      {
        label: t('appSetting.global'),
        value: CONFIG_TARGET.GLOBAL,
      },
    ];

    if (props.operationId !== false) {
      options.push({
        label: t('appSetting.interface'),
        value: CONFIG_TARGET.INTERFACE,
      });
    }

    if (props.dependency !== false) {
      options.push({
        label: t('appSetting.dependency'),
        value: CONFIG_TARGET.DEPENDENCY,
      });
    }

    return options;
  }, [t, props.operationId, props.dependency]);

  /**
   * 请求 InterfacesList
   */
  const { data: operationList = [] } = useRequest(
    () => ApplicationService.queryInterfacesList<'Interface'>({ appId: props.appId as string }),
    {
      ready: !!props.appId,
      onSuccess(res) {
        if (!props.operationId) {
          setOperationValue(res?.[0]?.id);
          props.onOperationChange?.(res?.[0]?.id);
        }
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
    () => ApplicationService.getDependencyList({ operationId: operationValue as string }),
    {
      ready: !!operationValue,
      refreshDeps: [operationValue],
      onSuccess(res) {
        const dependencyList = res.dependencyList;
        if (!props.dependency && dependencyList.length) {
          const value = {
            operationType: dependencyList?.[0]?.operationType,
            operationName: dependencyList?.[0]?.operationName,
          };
          setDependencyValue(value);
          props.onDependencyChange?.(value);
        }
        setDependencyOptions(
          dependencyList.map((dependency) => ({
            label: dependency.operationType + '-' + dependency.operationName,
            value: dependency.operationType + '-' + dependency.operationName,
          })),
        );
      },
    },
  );

  const [dependencyOptions, setDependencyOptions] = useState<SelectProps['options']>();

  const handleTargetChange = useCallback((value: React.Key) => {
    setTargetValue(value as CONFIG_TARGET);
    props.onTargetChange?.(value as CONFIG_TARGET);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      setDependencyOptions,
    }),
    [],
  );

  return (
    <Space key='config-menu' ref={menuAnimateParent} style={{ display: 'flex', flexWrap: 'wrap' }}>
      <div key='config-target'>
        <div>
          <Label type='secondary'>{t('appSetting.configTarget')} </Label>
        </div>
        <Segmented value={targetValue} options={targetOptions} onChange={handleTargetChange} />
      </div>

      {targetValue !== CONFIG_TARGET.GLOBAL && (
        <div key='interface-select'>
          <div>
            <Label type='secondary'>{t('appSetting.interface')}</Label>
          </div>
          <Select
            optionFilterProp='label'
            placeholder='choose interface'
            popupMatchSelectWidth={false}
            // START 指定 operationId 时，Select 只读
            showSearch={!props.operationId}
            bordered={!props.operationId}
            suffixIcon={!props.operationId ? undefined : null}
            open={props.operationId ? false : undefined}
            // END 指定 operationId 时，Select 只读
            options={interfaceOptions}
            value={operationValue}
            onChange={(value) => {
              setOperationValue(value);
              props.onOperationChange?.(value);
            }}
            style={{ width: '160px' }}
          />
        </div>
      )}

      {targetValue === CONFIG_TARGET.DEPENDENCY && (
        <div key='dependency-select'>
          <div>
            <Typography.Text type='secondary'>
              <Label type='secondary'>{t('appSetting.dependency')}</Label>
            </Typography.Text>
          </div>
          <Select
            optionFilterProp='label'
            placeholder='choose external dependency'
            popupMatchSelectWidth={false}
            // START 指定 operationId 时，Select 只读
            showSearch={!props.dependency}
            bordered={!props.dependency}
            suffixIcon={!props.dependency ? undefined : null}
            open={props.dependency ? false : undefined}
            // END 指定 operationId 时，Select 只读
            loading={loadingDependency}
            options={dependencyOptions}
            value={dependencyKey}
            onChange={(value) => {
              if (!value) return;
              const [operationType, operationName] = value.split('-');
              const dependencyValue = {
                operationType,
                operationName,
              };
              setDependencyValue(dependencyValue);
              props.onDependencyChange?.(dependencyValue);
            }}
            style={{ width: '160px' }}
          />
        </div>
      )}
    </Space>
  );
});

export default GlobalInterfaceDependencySelect;
