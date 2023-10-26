import Icon, { BugOutlined, FontColorsOutlined, SketchOutlined } from '@ant-design/icons';
import { useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Button, Form, Input, Modal, Select, Space } from 'antd';
import React, { FC, useMemo } from 'react';

import { ReportService } from '@/services';
import { FeedbackType } from '@/services/ReportService';

export const FeedbackIconMap: { [key in FeedbackType]: FC } = {
  [FeedbackType.Bug]: BugOutlined,
  [FeedbackType.Design]: SketchOutlined,
  [FeedbackType.ArexProblem]: FontColorsOutlined,
};

export interface MarkExclusionModalProps {
  open?: boolean;
  planId?: string;
  planItemId?: string;
  recordId?: string;
  feedbackType?: FeedbackType;
  remark?: string;
  onClose?: () => void;
  onSuccess?: () => void;
}

const MarkExclusionModal = (props: MarkExclusionModalProps) => {
  const { message } = App.useApp();
  const { t } = useTranslation('components');

  const { run: feedbackScene } = useRequest(ReportService.feedbackScene, {
    manual: true,
    onSuccess(success) {
      success
        ? message.success(t('message.success', { ns: 'common' }))
        : message.error(t('message.error', { ns: 'common' }));
      props.onClose?.();
      props.onSuccess?.();
    },
  });

  const feedbackTypeOptions = useMemo(
    () => [
      {
        label: (
          <Space>
            <Icon component={FeedbackIconMap[FeedbackType.Bug]} />
            {t('replay.bug')}
          </Space>
        ),
        value: FeedbackType.Bug,
      },
      {
        label: (
          <Space>
            <Icon component={FeedbackIconMap[FeedbackType.Design]} />
            {t('replay.design')}
          </Space>
        ),
        value: FeedbackType.Design,
      },
      {
        label: (
          <Space>
            <Icon component={FeedbackIconMap[FeedbackType.ArexProblem]} />
            {t('replay.arexProblem')}
          </Space>
        ),
        value: FeedbackType.ArexProblem,
      },
    ],
    [t],
  );

  return (
    <Modal
      destroyOnClose
      title={t('replay.markExclusion')}
      footer={false}
      open={props.open}
      onCancel={props.onClose}
    >
      <Form
        initialValues={{
          planId: props.planId,
          planItemId: props.planItemId,
          recordId: props.recordId,
          feedbackType: props.feedbackType || FeedbackType.Bug,
          remark: props.remark,
        }}
        onFinish={feedbackScene}
      >
        <Form.Item hidden name='planId'>
          <Input />
        </Form.Item>
        <Form.Item hidden name='planItemId'>
          <Input />
        </Form.Item>
        <Form.Item hidden name='recordId'>
          <Input />
        </Form.Item>
        <Form.Item name='feedbackType' label={t('replay.exclusionType')}>
          <Select options={feedbackTypeOptions} />
        </Form.Item>
        <Form.Item name='remark' label={t('replay.remark')}>
          <Input.TextArea />
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit' style={{ float: 'right' }}>
            {t('ok', { ns: 'common' })}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MarkExclusionModal;
