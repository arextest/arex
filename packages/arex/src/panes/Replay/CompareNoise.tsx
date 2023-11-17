import { ReconciliationOutlined, SaveOutlined } from '@ant-design/icons';
import {
  EmptyWrapper,
  Label,
  PaneDrawer,
  Segmented,
  SpaceBetweenWrapper,
  TooltipButton,
  useArexPaneProps,
  useTranslation,
} from '@arextest/arex-core';
import { usePagination, useRequest } from 'ahooks';
import { App, Badge, Button, Checkbox, Space, Typography } from 'antd';
import React, { FC, useMemo, useState } from 'react';
import { useImmer } from 'use-immer';

import { Connector } from '@/constant';
import CompareNoiseOperationItem from '@/panes/Replay/CompareNoiseOperationItem';
import { ReportService, ScheduleService } from '@/services';
import { InterfaceNoiseItem, RandomNoise } from '@/services/ScheduleService';

export interface CompareNoiseProps {
  appId: string;
  readOnly?: boolean;
}

const CompareNoise: FC<CompareNoiseProps> = (props) => {
  const { t } = useTranslation('components');
  const { message } = App.useApp();
  const { data } = useArexPaneProps<{ planId: string }>();
  const [open, setOpen] = useState(false);
  const [selectNoise, setSelectNoise] = useImmer<{ [operationId: string]: RandomNoise[] }>({});

  const { data: { list: planStatistics } = { list: [] }, refresh: queryPlanStatistics } =
    usePagination(
      (params) =>
        ReportService.queryPlanStatistics({
          appId: props.appId,
          planId: data?.planId || undefined,
          ...params,
        }),
      {
        ready: !!props.appId,
        defaultPageSize: 1,
        defaultCurrent: 1,
        refreshDeps: [props.appId, data?.planId],
        onSuccess: () => {
          queryNoise();
        },
      },
    );

  const {
    data: noiseData = [],
    loading,
    refresh: queryNoise,
  } = useRequest(() => ScheduleService.queryNoise(planStatistics[0].planId), {
    ready: !!planStatistics.length,
    onBefore() {
      setSelectNoise({});
    },
    onSuccess: () => {
      handleToggleCheckAll();
    },
  });

  const allChecked = useMemo(() => {
    const checkedCount = Object.values(selectNoise).reduce((count, noise) => {
      count += noise.reduce((count, n) => {
        count += n.noiseItemList.length;
        return count;
      }, 0);
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
    () =>
      !allChecked &&
      Object.values(selectNoise).some((item) => item.some((n) => n.noiseItemList.length)),
    [selectNoise, allChecked],
  );

  const { run: excludeNoise } = useRequest(
    (interfaceNoiseItemList: InterfaceNoiseItem[]) =>
      ScheduleService.excludeNoise({
        appId: props.appId,
        planId: planStatistics[0].planId!,
        interfaceNoiseItemList,
      }),
    {
      manual: true,
      ready: !!planStatistics.length,
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
    // 先根据 value 中的 index 进行聚合
    const valueMap = value.reduce<{ [index: number]: string[] }>((map, item) => {
      const [path, indexStr] = item.split(Connector);
      const index = parseInt(indexStr);
      map[index] = map[index] || [];
      map[index].push(path);
      return map;
    }, {});

    // 再根据 valueMap 生成 checkedOperationNoise
    const checkedOperationNoise = noise.randomNoise.map((randomNoise, index) => {
      const noiseItemList = randomNoise.noiseItemList.filter((item) => {
        const entityPath = item.nodeEntity.map((entityItem) => entityItem.nodeName).join('/');
        return valueMap[index]?.includes(entityPath);
      });
      return {
        ...randomNoise,
        noiseItemList,
      };
    });
    setSelectNoise((state) => {
      state[noise.operationId] = checkedOperationNoise;
    });
  };

  const handleToggleCheckAll = () => {
    !allChecked
      ? setSelectNoise(
          noiseData.reduce<{ [operationId: string]: RandomNoise[] }>((map, data) => {
            map[data.operationId] = data.randomNoise;
            return map;
          }, {}),
        )
      : setSelectNoise({});
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

    // 过滤 interfaceNoiseItemList 中 noiseItemList 为空的项
    const interfaceNoiseItemListFilter = interfaceNoiseItemList
      .map((item) => ({
        ...item,
        randomNoise: item.randomNoise.filter((noise) => noise.noiseItemList.length),
      }))
      .filter((item) => item.randomNoise.length);
    interfaceNoiseItemListFilter.length && excludeNoise(interfaceNoiseItemListFilter);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectNoise({});
  };

  return (
    <>
      <Badge dot={!!noiseData.length} offset={[-4, 4]}>
        <TooltipButton
          size='small'
          icon={<ReconciliationOutlined />}
          title={t('replay.denoise')}
          disabled={props.readOnly}
          onClick={() => {
            setOpen(true);
            queryPlanStatistics();
          }}
        />
      </Badge>

      <PaneDrawer
        destroyOnClose
        width='60%'
        open={open}
        title={
          <SpaceBetweenWrapper>
            <div>
              <Typography.Text ellipsis style={{ maxWidth: '60%' }}>
                {t('replay.denoise')}
              </Typography.Text>

              <Segmented
                size='small'
                options={[
                  { label: t('appSetting.nodesIgnore'), value: 'nodesIgnore' },
                  { label: t('appSetting.nodesSort'), value: 'nodesSort', disabled: true },
                ]}
                defaultValue='nodesIgnore'
                style={{ marginLeft: '8px' }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                flexShrink: 0,
                marginRight: '8px',
              }}
            >
              <Label type='secondary' style={{ wordBreak: 'keep-all' }}>
                {t('checkAll', { ns: 'common' })}
              </Label>
              <Checkbox
                indeterminate={indeterminate}
                checked={allChecked}
                onChange={handleToggleCheckAll}
              />
            </div>
          </SpaceBetweenWrapper>
        }
        extra={
          <Button size='small' type='primary' icon={<SaveOutlined />} onClick={handleSave}>
            {t('save', { ns: 'common' })}
          </Button>
        }
        styles={{
          body: {
            padding: '8px 16px',
          },
        }}
        onClose={handleClose}
      >
        <EmptyWrapper
          loading={loading}
          empty={!noiseData.length}
          description={t('replay.noDenoiseRecommended')}
        >
          <Space
            size='middle'
            direction='vertical'
            style={{ width: '100%', maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}
          >
            {noiseData.map((noise) => (
              <CompareNoiseOperationItem
                key={noise.operationId}
                value={selectNoise[noise.operationId]}
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
