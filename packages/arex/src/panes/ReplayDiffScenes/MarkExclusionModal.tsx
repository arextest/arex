import { useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Button, Form, Input, Modal, Select } from 'antd';
import React from 'react';

import { ReportService } from '@/services';
import { FeedbackType } from '@/services/ReportService';

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
  const { t } = useTranslation('common');

  const { run: feedbackScene } = useRequest(ReportService.feedbackScene, {
    manual: true,
    onSuccess(success) {
      success ? message.success(t('message.success')) : message.error(t('message.error'));
      props.onClose?.();
      props.onSuccess?.();
    },
  });

  return (
    <Modal
      destroyOnClose
      title={'MarkExclusion'}
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
        <Form.Item name='feedbackType' label={'FeedbackType'}>
          <Select
            options={[
              {
                label: 'Bug',
                value: FeedbackType.Bug,
              },
              {
                label: 'Design',
                value: FeedbackType.ByDesign,
              },
              {
                label: 'ArexProblem',
                value: FeedbackType.ArexProblem,
              },
            ]}
          />
        </Form.Item>
        <Form.Item name='remark' label={'Remark'}>
          <Input.TextArea />
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit' style={{ float: 'right' }}>
            {t('remark')}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MarkExclusionModal;
