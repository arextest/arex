import { ClearOutlined, SaveOutlined } from '@ant-design/icons';
import {
  EmptyWrapper,
  Label,
  PaneDrawer,
  SpaceBetweenWrapper,
  useTranslation,
} from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Button, Checkbox, Space, Spin } from 'antd';
import React, { FC, useMemo, useState } from 'react';
import { useImmer } from 'use-immer';

import { Connector } from '@/constant';
import CompareNoiseOperationItem from '@/panes/Replay/CompareNoiseOperationItem';
import { ScheduleService } from '@/services';
import { InterfaceNoiseItem, RandomNoise } from '@/services/ScheduleService';

export interface CompareNoiseProps {
  appId: string;
  planId?: string;
  readOnly?: boolean;
}

const CompareNoise: FC<CompareNoiseProps> = (props) => {
  const { t } = useTranslation('components');
  const { message } = App.useApp();

  const [open, setOpen] = useState(false);
  const [selectNoise, setSelectNoise] = useImmer<{ [operationId: string]: RandomNoise[] }>({});

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

  const { run: excludeNoise } = useRequest(
    (interfaceNoiseItemList: InterfaceNoiseItem[]) =>
      ScheduleService.excludeNoise({
        appId: props.appId,
        planId: props.planId!,
        interfaceNoiseItemList,
      }),
    {
      manual: true,
      ready: !!props.planId,
      onSuccess(success) {
        if (success) {
          setOpen(false);
          message.success(t('message.updateSuccess', { ns: 'common' }));
        } else {
          message.error(t('message.updateFailed', { ns: 'common' }));
        }
      },
    },
  );

  const handleChecked = (value: string[], noise: InterfaceNoiseItem) => {
    const checkedOperationNoise = value.map((item) => {
      const [path, indexStr] = item.split(Connector);
      const index = parseInt(indexStr);
      return noise.randomNoise[index];
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
    const interfaceNoiseItemList = Object.entries(selectNoise).reduce<InterfaceNoiseItem[]>(
      (list, [operationId, randomNoise]) => {
        list.push({
          operationId,
          randomNoise,
          disorderedArrayNoise: [], // TODO
        });
        return list;
      },
      [],
    );

    interfaceNoiseItemList.length && excludeNoise(interfaceNoiseItemList);
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
        <EmptyWrapper loading={loading} empty={!noiseData.length}>
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
        </EmptyWrapper>
      </PaneDrawer>
    </>
  );
};

export default CompareNoise;
