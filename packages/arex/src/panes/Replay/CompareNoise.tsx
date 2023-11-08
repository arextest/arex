import { ClearOutlined, SaveOutlined } from '@ant-design/icons';
import { Label, PaneDrawer, SpaceBetweenWrapper, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Button, Checkbox, Space, Spin } from 'antd';
import React, { FC, useMemo, useState } from 'react';
import { useImmer } from 'use-immer';

import { Connector } from '@/constant';
import CompareNoiseOperationItem from '@/panes/Replay/CompareNoiseOperationItem';
import { ComparisonService, ScheduleService } from '@/services';
import { IgnoreNodeBase } from '@/services/ComparisonService';
import { InterfaceNoiseItem } from '@/services/ScheduleService';

export interface CompareNoiseProps {
  appId: string;
  planId?: string;
  readOnly?: boolean;
}

const CompareNoise: FC<CompareNoiseProps> = (props) => {
  const { t } = useTranslation('components');
  const { message } = App.useApp();

  const [open, setOpen] = useState(false);
  const [selectNoise, setSelectNoise] = useImmer<{ [operationId: string]: IgnoreNodeBase[] }>({});

  const {
    data: noiseData = [],
    loading,
    refresh: queryNoise,
  } = useRequest(() => ScheduleService.queryNoise(props.planId!), {
    manual: true,
    ready: !!props.planId,
  });

  const allChecked = useMemo(() => {
    const checkedCount = Object.values(selectNoise).reduce((count, noise) => {
      count += noise.length;
      return count;
    }, 0);
    const allCount = noiseData.reduce((count, operationNoise) => {
      const operationCount = operationNoise.randomNoise.reduce((count, randomNoise) => {
        count += randomNoise.noiseItemList.length;
        return count;
      }, 0);
      return count + operationCount;
    }, 0);

    return !!allCount && checkedCount === allCount;
  }, [selectNoise, noiseData]);

  const indeterminate = useMemo(
    () => !allChecked && Object.values(selectNoise).some((item) => item.length),
    [selectNoise, allChecked],
  );

  /**
   * 批量新增 IgnoreNode
   */
  const { run: batchInsertIgnoreNode } = useRequest(ComparisonService.batchInsertIgnoreNode, {
    manual: true,
    onSuccess(success) {
      if (success) {
        message.success(t('message.updateSuccess', { ns: 'common' }));
      } else {
        message.error(t('message.updateFailed', { ns: 'common' }));
      }
    },
  });

  const handleChecked = (value: string[], noise: InterfaceNoiseItem) => {
    const checkedOperationNoise = value.map((item) => {
      const [path, indexStr] = item.split(Connector);
      const index = parseInt(indexStr);
      const entryPoint = noise.randomNoise[index].mockCategoryType.entryPoint;
      return {
        appId: props.appId,
        exclusions: path.split('/'),
        operationId: noise.operationId,
        pathIndex: item,
        ...(entryPoint
          ? {}
          : {
              operationName: noise.randomNoise[index].operationName,
              operationType: noise.randomNoise[index].operationType,
            }),
      };
    });

    setSelectNoise((state) => {
      state[noise.operationId] = checkedOperationNoise;
    });
  };

  const handleToggleCheckAll = () => {
    Array.from(document.getElementsByClassName(`denoise-checkbox-${props.appId}`)).forEach(
      (checkbox) => {
        indeterminate
          ? // @ts-ignore
            !checkbox.getElementsByClassName('ant-checkbox-input')?.[0]?.checked &&
            // @ts-ignore
            checkbox.click?.()
          : // @ts-ignore
            checkbox.click?.();
      },
    );
  };

  const handleSave = () => {
    const params = Object.values(selectNoise).reduce((list, item) => {
      list.push(...item);
      return list;
    }, []);

    params.length && batchInsertIgnoreNode(params);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectNoise({});
  };

  return (
    <>
      <Button
        type='link'
        size='small'
        icon={<ClearOutlined />}
        disabled={props.readOnly}
        onClick={() => {
          setOpen(true);
          queryNoise();
        }}
      >
        {t('replay.denoise')}
      </Button>

      <PaneDrawer
        destroyOnClose
        width='60%'
        open={open}
        title={
          <SpaceBetweenWrapper>
            {t('replay.denoise')}
            <span style={{ marginRight: '16px' }}>
              <Label type='secondary'>{t('checkAll', { ns: 'common' })}</Label>
              <Checkbox
                indeterminate={indeterminate}
                checked={allChecked}
                onChange={handleToggleCheckAll}
              />
            </span>
          </SpaceBetweenWrapper>
        }
        extra={
          <Button size='small' type='primary' icon={<SaveOutlined />} onClick={handleSave}>
            {t('save')}
          </Button>
        }
        onClose={handleClose}
      >
        {loading && <Spin />}
        <Space
          size='middle'
          direction='vertical'
          style={{ width: '100%', maxHeight: '75vh', overflow: 'auto' }}
        >
          {noiseData.map((noise) => (
            <CompareNoiseOperationItem
              key={noise.operationId}
              appId={props.appId}
              noise={noise}
              onChange={(value) => handleChecked(value, noise)}
            />
          ))}
        </Space>
      </PaneDrawer>
    </>
  );
};

export default CompareNoise;
