import { LabelsGroup, RequestMethodIcon, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Form, Input, Modal, Typography } from 'antd';
import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react';

import { FileSystemService, ReportService } from '@/services';
import { AddItemFromRecordByDefaultReq } from '@/services/FileSystemService';
import { ReplayCaseType } from '@/services/ReportService';
import { useCollections, useWorkspaces } from '@/store';

const { Text } = Typography;

export type SaveCaseRef = {
  openModal: (record: ReplayCaseType) => void;
};

export type SaveCaseProps = {
  planId: string;
  operationId: string;
  operationName: string;
  appId: string;
};

const SaveCase = forwardRef<SaveCaseRef, SaveCaseProps>((props, ref) => {
  const { notification } = App.useApp();
  const { t } = useTranslation(['components', 'common', 'page']);
  const { getCollections } = useCollections();
  const { activeWorkspaceId: workspaceId } = useWorkspaces();

  const [form] = Form.useForm();

  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState('');

  useImperativeHandle(ref, () => ({
    openModal: (record) => {
      setOpen(true);
      setTitle(record.recordId);
      form.setFieldsValue({
        recordId: record.recordId,
        nodeName: record.recordId,
      });
    },
  }));

  const { run: dddItemFromRecordByDefault, loading } = useRequest(
    (values: AddItemFromRecordByDefaultReq) => FileSystemService.addItemFromRecordByDefault(values),
    {
      manual: true,
      onSuccess: (res) => {
        if (res.body?.success) {
          notification.success({ message: t('message.saveSuccess', { ns: 'common' }) });
          handleClose();
          getCollections();
        } else {
          notification.error({
            message: t('message.saveFailed', { ns: 'common' }),
            description: res.responseStatusType.responseDesc,
          });
        }
      },
    },
  );

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      dddItemFromRecordByDefault({
        workspaceId: workspaceId,
        appName: props.appId,
        interfaceName: props.operationName,
        nodeName: values.nodeName,
        planId: props.planId,
        operationId: props.operationId,
        recordId: values.recordId,
        labelIds: values.labelIds,
      });
    });
  };

  const handleClose = () => {
    setOpen(false);
    form.resetFields();
  };

  const { data: labelData = [] } = useRequest(() => ReportService.queryLabels({ workspaceId }));
  const tagOptions = useMemo(
    () =>
      labelData.map((i) => ({
        label: i.labelName,
        value: i.id,
        color: i.color,
      })),
    [labelData],
  );

  return (
    <>
      <Modal
        open={open}
        title={`${t('replay.saveCase')} - ${title}`}
        okText={t('replay.create')}
        cancelText={t('cancel', { ns: 'common' })}
        onCancel={handleClose}
        onOk={handleSubmit}
        confirmLoading={loading}
      >
        <Form form={form} layout='vertical' name='form_in_modal'>
          <Form.Item hidden name='recordId' label='recordId'>
            <Input />
          </Form.Item>

          <Form.Item
            name='nodeName'
            label={t('replay.caseName')}
            rules={[
              {
                required: true,
                message: t('replay.emptyCaseName') as string,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name='labelIds' label={t('replay.caseLabels')}>
            <LabelsGroup options={tagOptions} />
          </Form.Item>
          <div>
            <span>{t('replay.saveTo')}</span>
            <Text type='secondary'>
              {props.appId} &gt;
              <RequestMethodIcon.Get style={{ marginLeft: '8px' }} />
              {props.operationName}
            </Text>
          </div>
        </Form>
      </Modal>
    </>
  );
});

export default SaveCase;
