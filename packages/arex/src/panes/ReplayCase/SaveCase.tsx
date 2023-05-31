import { useRequest } from 'ahooks';
import { App, Form, FormProps, Input, Modal, TreeSelect, Typography } from 'antd';
import { getLocalStorage, useTranslation } from 'arex-core';
import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react';

import { CollectionNodeType, EMAIL_KEY } from '@/constant';
import { FileSystemService } from '@/services';
import { AddItemFromRecordReq, CollectionType } from '@/services/FileSystemService';
import { ReplayCaseType } from '@/services/ReportService';
import { useCollections, useWorkspaces } from '@/store';

const { Text } = Typography;

type OptionType = {
  label: string;
  value: string;
  disabled?: boolean;
  children?: OptionType[];
};

export type SaveCaseRef = {
  openModal: (record: ReplayCaseType) => void;
};

export type SaveCaseProps = {
  planId: string;
  operationId: string;
};

const SaveCase = forwardRef<SaveCaseRef, SaveCaseProps>((props, ref) => {
  const { notification } = App.useApp();
  const { t } = useTranslation(['components', 'common']);
  const userName = getLocalStorage(EMAIL_KEY) as string;

  const { collectionsTreeData, getPath, getCollections } = useCollections();
  const { activeWorkspaceId: workspaceId } = useWorkspaces();

  const [form] = Form.useForm();
  const [open, setOpen] = useState<boolean>(false);

  const [title, setTitle] = useState('');
  const [pathTo, setPathTo] = useState('');

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

  const collectionTreeSelectData = useMemo(() => {
    const mapTree = (tree: CollectionType[]) => {
      const result: OptionType[] = [];
      for (const node of tree) {
        result.push({
          label: node.nodeName,
          value: node.infoId,
          disabled: node.nodeType !== CollectionNodeType.interface,
          children: node.nodeType === CollectionNodeType.folder ? mapTree(node.children || []) : [],
        });
      }
      return result;
    };
    return mapTree(collectionsTreeData);
  }, [collectionsTreeData]);

  const { run: addItemFromRecord } = useRequest(
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

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      addItemFromRecord({
        parentPath: getPath(values.savePath).map((path) => path.id),
        nodeName: values.nodeName,
        recordId: values.recordId,
      });
    });
  };

  const handleValuesChange: FormProps['onValuesChange'] = (value, values) => {
    const touched = Object.prototype.hasOwnProperty.call(value, 'savePath');

    touched &&
      setPathTo(
        getPath(values.savePath)
          .map((path) => path.name)
          .join('/'),
      );
  };

  const handleClose = () => {
    setOpen(false);
    form.resetFields();
    setPathTo('');
  };

  return (
    <Modal
      open={open}
      title={`${t('replay.saveCase')} - ${title}`}
      okText={t('replay.create')}
      cancelText={t('cancel', { ns: 'common' })}
      onCancel={handleClose}
      onOk={handleSubmit}
    >
      <Form form={form} onValuesChange={handleValuesChange} layout='vertical' name='form_in_modal'>
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

        <Form.Item
          name='savePath'
          label={
            <p>
              <span>{t('replay.saveTo')}</span> <Text type='secondary'>{pathTo}</Text>
            </p>
          }
          rules={[
            {
              required: true,
              message: t('replay.emptyTitle') as string,
            },
          ]}
        >
          <TreeSelect
            allowClear
            showSearch
            treeDefaultExpandAll
            treeData={collectionTreeSelectData}
            treeNodeFilterProp={'label'}
            placeholder={t('replay.selectTree')}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default SaveCase;
