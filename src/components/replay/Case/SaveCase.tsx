import { Form, Input, Modal, notification, TreeSelect, Typography } from 'antd';
import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { EmailKey } from '../../../constant';
import request from '../../../helpers/api/axios';
import { treeFindPath } from '../../../helpers/collection/util';
import { getLocalStorage } from '../../../helpers/utils';
import { ReplayCase as ReplayCaseType } from '../../../services/Replay.type';
import { useStore } from '../../../store';

const { Text } = Typography;

export type SaveCaseRef = {
  openModal: (record: ReplayCaseType) => void;
};

export type SaveCaseProps = {
  operationId: number;
};

const SaveCase = forwardRef<SaveCaseRef, SaveCaseProps>((props, ref) => {
  const params = useParams();
  const { collectionTreeData } = useStore();
  const [form] = Form.useForm();
  const [value, setValue] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);

  const [title, setTitle] = useState('');

  const onChange = (newValue: string) => {
    setValue(newValue);
  };

  useImperativeHandle(ref, () => ({
    openModal: (record) => {
      console.log(record, 'record');
      setOpen(true);
      setTitle(record.recordId);
      form.setFieldsValue({
        recordId: record.recordId,
        caseName: record.recordId,
      });
    },
  }));

  // 深度优先遍历
  const collectionTreeSelectData = useMemo(() => {
    const mapTree = (tree) => {
      const haveChildren = Array.isArray(tree.children) && tree.children.length > 0;
      return {
        ...tree,
        disabled: tree.nodeType !== 1,
        children: haveChildren ? tree.children.map((i) => mapTree(i)) : [],
      };
    };
    return mapTree({ children: collectionTreeData })['children'];
  }, [collectionTreeData]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      // TODO 集合那边加一个刷新
      request
        .post('/api/filesystem/addItemFromRecord', {
          workspaceId: params['workspaceId'],
          parentPath: treeFindPath(collectionTreeData, (node) => node.key === value).map(
            (i) => i.key,
          ),
          nodeName: values.caseName,
          recordId: values.recordId,
          userName: getLocalStorage<string>(EmailKey),
          operationId: props.operationId,
        })
        .then((res) => {
          if (res?.body?.success) {
            notification.success({ message: 'Save success' });
            setOpen(false);
          } else {
            notification.error({
              message: res.responseStatusType.responseDesc,
            });
          }
        });
    });
  };

  return (
    <div>
      <Modal
        open={open}
        title={`SAVE CASE - ${title}`}
        okText='Create'
        cancelText='Cancel'
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
      >
        <Form form={form} layout='vertical' name='form_in_modal'>
          <Form.Item style={{ display: 'none' }} name='recordId' label='recordId'>
            <Input />
          </Form.Item>
          <Form.Item
            name='caseName'
            label='CaseTable name'
            rules={[
              {
                required: true,
                message: 'Please input case name!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <p>
            <span>Save to </span>
            <Text type='secondary'>
              {treeFindPath(collectionTreeData, (node) => node.key === value)
                ?.map((i) => i.title)
                .join(' / ')}
            </Text>
          </p>
          <Form.Item
            name='savePath'
            label=''
            rules={[
              {
                required: true,
                message: 'Please input the title of collection!',
              },
            ]}
          >
            <TreeSelect
              fieldNames={{ label: 'title', value: 'key' }}
              style={{ width: '100%' }}
              value={value}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={collectionTreeSelectData}
              placeholder='Please select'
              treeDefaultExpandAll
              onChange={onChange}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

export default SaveCase;
