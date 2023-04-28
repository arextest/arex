import { useRequest } from 'ahooks';
import { App, Form, Input, Modal, TreeSelect, Typography } from 'antd';
import { useTranslation } from 'arex-core';
import { getLocalStorage } from 'arex-core';
import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react';

import { EMAIL_KEY } from '../../constant';
import { FileSystemService } from '../../services';
import { AddItemFromRecordReq } from '../../services/FileSystemService';
import { ReplayCaseType } from '../../services/ReportService';
import { useWorkspaces } from '../../store';
import { treeFindPath } from '../../utils';

const { Text } = Typography;

export type SaveCaseRef = {
  openModal: (record: ReplayCaseType) => void;
};

export type SaveCaseProps = {
  operationId: string;
};

const SaveCase = forwardRef<SaveCaseRef, SaveCaseProps>((props, ref) => {
  const { notification } = App.useApp();
  const { t } = useTranslation(['components', 'common']);
  const userName = getLocalStorage(EMAIL_KEY) as string;
  const { activeWorkspaceId: workspaceId } = useWorkspaces();
  // TODO get from collectionStore
  const collectionTreeData: any[] = [];

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

  // 深度优先遍历
  // TODO
  const collectionTreeSelectData: any[] = [];
  // const collectionTreeSelectData = useMemo(() => {
  //   const mapTree = (tree: any) => {
  //     const haveChildren = Array.isArray(tree.children) && tree.children.length > 0;
  //     return {
  //       ...tree,
  //       disabled: tree.nodeType !== 1,
  //       children: haveChildren ? tree.children.map((i: any) => mapTree(i)) : [],
  //     };
  //   };
  //   return mapTree({ children: collectionTreeData })['children'];
  // }, [collectionTreeData]);

  const { run: addItemFromRecord } = useRequest(
    (values: Pick<AddItemFromRecordReq, 'parentPath' | 'nodeName' | 'recordId'>) =>
      FileSystemService.addItemFromRecord({
        workspaceId: workspaceId as string,
        userName,
        operationId: props.operationId,
        ...values,
      }),
    {
      manual: true,
      onSuccess: (success) => {
        if (success) {
          notification.success({ message: t('message.saveSuccess', { ns: 'common' }) });
          setOpen(false);
        }
      },
    },
  );

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      // TODO 集合那边加一个刷新
      addItemFromRecord({
        parentPath: treeFindPath(collectionTreeData, (node) => node.key === values.savePath).map(
          (i) => i.key,
        ),
        nodeName: values.nodeName,
        recordId: values.recordId,
      });
    });
  };

  return (
    <div>
      <Modal
        open={open}
        title={`${t('replay.saveCase')} - ${title}`}
        okText={t('replay.create')}
        cancelText={t('cancel', { ns: 'common' })}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
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

          <Form.Item
            name='savePath'
            label={
              <p>
                <span>{t('replay.saveTo')}</span>{' '}
                <Text type='secondary'>
                  {/*  TODO path */}
                  path
                  {/*{treeFindPath(collectionTreeData, (node) => node.key === value)*/}
                  {/*  ?.map((i) => i.title)*/}
                  {/*  .join(' / ')}*/}
                </Text>
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
              fieldNames={{ label: 'title', value: 'key' }}
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={collectionTreeSelectData}
              placeholder={t('replay.selectTree')}
              treeDefaultExpandAll
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

export default SaveCase;
