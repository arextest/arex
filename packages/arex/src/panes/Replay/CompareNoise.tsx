import { QuestionOutlined } from '@ant-design/icons';
import { useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Button, Modal, Space } from 'antd';
import React, { FC, useState } from 'react';
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
  const { t } = useTranslation();
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
    onSuccess() {
      setOpen(true);
    },
  });

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

  const handleSave = () => {
    const params = Object.values(selectNoise).reduce((list, item) => {
      list.push(...item);
      return list;
    }, []);

    batchInsertIgnoreNode(params);
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
        icon={<QuestionOutlined />}
        loading={loading}
        disabled={props.readOnly}
        onClick={queryNoise}
      >
        {t('replay.denoise')}
      </Button>

      <Modal
        destroyOnClose
        title={t('replay.denoise')}
        open={open}
        width='50%'
        onCancel={handleClose}
        onOk={handleSave}
      >
        <Space
          size='middle'
          direction='vertical'
          style={{ width: '100%', maxHeight: '75vh', overflow: 'auto' }}
        >
          {noiseData.map((noise) => (
            <CompareNoiseOperationItem
              key={noise.operationId}
              noise={noise}
              onChange={(value) => handleChecked(value, noise)}
            />
          ))}
        </Space>
      </Modal>
    </>
  );
};

export default CompareNoise;
