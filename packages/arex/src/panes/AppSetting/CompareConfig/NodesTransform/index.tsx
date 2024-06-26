import { Label, useTranslation } from '@arextest/arex-core';

import { App, Button, Card, Select } from 'antd';
import React, { FC, useState } from 'react';

import { DependencyParams } from '@/services/ComparisonService';

import { CONFIG_TARGET } from '../index';
import { useRequest } from 'ahooks';
import { ComparisonService } from '@/services';

export type NodesTransformProps = {
  appId?: string;
  operationId?: string;
  dependency?: DependencyParams;
  configTarget: CONFIG_TARGET;
  contractParsed?: { [key: string]: any };
  syncing?: boolean;
  onSync?: () => void;
  loadingContract?: boolean;
};

const NodesTransform: FC<NodesTransformProps> = (props) => {
  const { message } = App.useApp();
  const { t } = useTranslation();

  const [methodValue, setMethodValue] = useState('');

  const { data: methods = [] } = useRequest(ComparisonService.getTransformMethod, {
    ready: !!props.appId,
    defaultParams: [props.appId!],
  });

  const { data: transformData = [], refresh: queryTransformRootNode } = useRequest(
    () =>
      ComparisonService.queryTransformRootNode({
        appId: props.appId!,
        operationId: props.operationId,
        ...(props.dependency || {}),
      }),
    {
      ready: !!props.appId,
      refreshDeps: [props.appId, props.operationId, props.dependency],
      onSuccess: (data) => {
        setMethodValue(data[0]?.transformMethodName);
      },
    },
  );

  const { run: updateTransformNode } = useRequest(
    () =>
      ComparisonService.updateTransformRootNode({
        appId: props.appId!,
        operationId: props.operationId,
        ...(props.dependency || {}),
        transformMethodName: methodValue,
      }),
    {
      manual: true,
      onSuccess: (success) => {
        if (success) {
          message.success(t('common:message.updateSuccess'));
          queryTransformRootNode();
        } else message.error(t('common:message.updateFailed'));
      },
    },
  );

  const { run: deleteTransformRootNode } = useRequest(ComparisonService.deleteTransformRootNode, {
    manual: true,
    onSuccess: (success) => {
      if (success) {
        message.success(t('common:message.updateSuccess'));
        queryTransformRootNode();
      } else message.error(t('common:message.updateFailed'));
    },
  });

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Label>Transform Method</Label>
          <Select
            allowClear
            value={methodValue}
            options={methods.map((method) => ({
              value: method,
              label: method,
            }))}
            placeholder={t('components:appSetting.transformMethodName')}
            onChange={setMethodValue}
            style={{ width: '120px' }}
          />
        </div>

        <Button
          type='primary'
          onClick={() => {
            if (methodValue) {
              updateTransformNode();
            } else {
              if (!transformData[0]?.id)
                return message.warning(t('components:appSetting.selectMethodTip'));
              deleteTransformRootNode(transformData[0]?.id);
            }
          }}
        >
          {t('common:save')}
        </Button>
      </div>
    </Card>
  );
};

export default NodesTransform;
