import { getLocalStorage, useTranslation } from '@arextest/arex-core';
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { App, Form, Input, Modal, Typography } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

import { EMAIL_KEY } from '@/constant';
import { FileSystemService } from '@/services';
import { AddItemFromRecordByDefaultReq, AddItemFromRecordReq } from '@/services/FileSystemService';
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
  const userName = getLocalStorage(EMAIL_KEY) as string;
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

  const { run: addItemFromRecord, loading } = useRequest(
    (values: Pick<AddItemFromRecordReq, 'parentPath' | 'nodeName' | 'recordId'>) =>
      FileSystemService.addItemFromRecord({
        workspaceId: workspaceId as string,
        userName,
        planId: props.planId,
        operationId: props.operationId,
        ...values,
      }),
    {
      manual: true,
      onSuccess: (success) => {
        if (success) {
          notification.success({ message: t('message.saveSuccess', { ns: 'common' }) });
          handleClose();
          getCollections();
        } else {
          notification.error({ message: t('message.saveFailed', { ns: 'common' }) });
        }
      },
    },
  );

  const { run: dddItemFromRecordByDefault, loading: l1 } = useRequest(
    (values: AddItemFromRecordByDefaultReq) => FileSystemService.dddItemFromRecordByDefault(values),
    {
      manual: true,
      onSuccess: (success) => {
        if (success) {
          notification.success({ message: t('message.saveSuccess', { ns: 'common' }) });
          handleClose();
          getCollections();
        } else {
          notification.error({ message: t('message.saveFailed', { ns: 'common' }) });
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
      });
    });
  };

  const handleClose = () => {
    setOpen(false);
    form.resetFields();
  };

  // function addData(tree) {
  //   return tree.map((item) => {
  //     if (item.children && item.children.length > 0) {
  //       return {
  //         type: item.nodeType,
  //         name: item.nodeName,
  //         key: item.infoId,
  //         item: addData(item.children),
  //         request: item.method
  //           ? {
  //               method: item.method,
  //             }
  //           : undefined,
  //       };
  //     } else {
  //       return {
  //         type: item.nodeType,
  //         name: item.nodeName,
  //         key: item.infoId,
  //         item: [],
  //         request: item.method
  //           ? {
  //               method: item.method,
  //             }
  //           : undefined,
  //       };
  //     }
  //   });
  // }

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

          <div>
            <span>{t('replay.saveTo')}</span>{' '}
            <Text type='secondary'>
              {props.appId} &gt;{' '}
              <span
                css={css`
                  color: #66bb6a;
                `}
              >
                GET
              </span>{' '}
              {props.operationName}
            </Text>
            {/*<Tooltip title={t('replay.saveto', { ns: 'page' })}>*/}
            {/*  <Button*/}
            {/*    onClick={() => {*/}
            {/*      setOpen1(true);*/}
            {/*    }}*/}
            {/*    size={'small'}*/}
            {/*    css={css`*/}
            {/*      padding: 0 4px !important;*/}
            {/*      margin-left: 10px;*/}
            {/*    `}*/}
            {/*  >*/}
            {/*    <DownOutlined />*/}
            {/*  </Button>*/}
            {/*</Tooltip>*/}
          </div>
        </Form>
      </Modal>

      {/*<CollectionsSaveRequest*/}
      {/*  title={t('replay.saveCase')}*/}
      {/*  treeData={addData(collectionsTreeData)}*/}
      {/*  open={open1}*/}
      {/*  requestName={form.getFieldsValue().recordId}*/}
      {/*  onSave={(folderKey, requestName) => {*/}
      {/*    addItemFromRecord({*/}
      {/*      parentPath: getPath(folderKey).map((path) => path.id),*/}
      {/*      nodeName: requestName,*/}
      {/*      recordId: form.getFieldsValue().recordId,*/}
      {/*    });*/}
      {/*  }}*/}
      {/*  onClose={() => {*/}
      {/*    setOpen1(false);*/}
      {/*  }}*/}
      {/*/>*/}
    </>
  );
});

export default SaveCase;
