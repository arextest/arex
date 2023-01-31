import { App, Form, Input, Modal, Select, TreeSelect, Typography } from 'antd';
import React, { FC, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { EmailKey } from '../../../constant';
import { treeFindPath } from '../../../helpers/collection/util';
import { getLocalStorage } from '../../../helpers/utils';
import { CollectionService, NodeObject } from '../../../services/Collection.service';
import { FileSystemService } from '../../../services/FileSystem.service';
import { HoppRESTRequest } from '../../http/data/rest';
const { Text } = Typography;

type SaveRequestButtonProps = {
  open: boolean;
  reqParams?: HoppRESTRequest;
  collectionTreeData: NodeObject[];
  onSaveAs: any;
  onClose: () => void;
};

const SaveRequestButton: FC<SaveRequestButtonProps> = ({
  open,
  reqParams,
  collectionTreeData,
  onSaveAs,
  onClose,
}) => {
  const params = useParams();
  const { message } = App.useApp();
  const userName = getLocalStorage<string>(EmailKey);

  const [form] = Form.useForm();
  const [value, setValue] = useState<string>();
  const [nodeType, setNodeType] = useState<string>('1');

  const collectionTreeSelectData = useMemo(() => {
    const mapTree = (tree: any) => {
      const haveChildren = Array.isArray(tree.children) && tree.children.length > 0;
      return {
        ...tree,
        disabled:
          (tree.nodeType !== 3 && nodeType === '1') || (nodeType === '2' && tree.nodeType !== 1),
        children: haveChildren ? tree.children.map((i: any) => mapTree(i)) : [],
      };
    };
    return mapTree({ children: collectionTreeData })['children'];
  }, [collectionTreeData, nodeType]);

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        CollectionService.addItem({
          id: params.workspaceId,
          nodeName: values.requestName,
          nodeType: values.nodeType,
          parentPath: treeFindPath(collectionTreeData, (node) => node.key === value)?.map(
            (i) => i.key,
          ),
          userName,
        })
          .then((res) => {
            const req = {
              '1': FileSystemService.saveInterface,
              '2': FileSystemService.saveCase,
            };
            if (reqParams) {
              // @ts-ignore
              req[values.nodeType]({
                address: {
                  endpoint: reqParams.endpoint,
                  method: reqParams.method,
                },
                body: reqParams.body,
                headers: reqParams.headers,
                params: reqParams.params,
                testScripts: reqParams.testScripts,
                preRequestScripts: reqParams.preRequestScripts,
                testAddress: {
                  endpoint: reqParams.compareEndpoint,
                  method: reqParams.compareMethod,
                },
                id: res.body.infoId,
                workspaceId: params.workspaceId,
              }).then(() => {
                // 通知父组件
                onSaveAs({
                  key: res.body.infoId,
                  title: values.requestName,
                });
                onClose();
                form.resetFields();
              });
            }
          })
          .catch((e) => {
            message.error(e);
          });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      open={open}
      title={`SAVE ${nodeType === '1' ? 'REQUEST' : 'CASE'}`}
      okText='Create'
      cancelText='Cancel'
      onCancel={onClose}
      onOk={handleSave}
    >
      <Form
        form={form}
        layout='vertical'
        name='form_in_modal'
        initialValues={{
          modifier: 'public',
          nodeType: '1',
        }}
      >
        <Form.Item name='nodeType' label='Type'>
          <Select
            options={[
              { label: 'Request', value: '1' },
              { label: 'Case', value: '2' },
            ]}
            onSelect={(val) => {
              setNodeType(val);
            }}
          />
        </Form.Item>
        <Form.Item
          name='requestName'
          label='Request name'
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
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
            treeDefaultExpandAll
            placeholder='Please select'
            value={value}
            treeData={collectionTreeSelectData}
            fieldNames={{ label: 'title', value: 'key' }}
            onChange={setValue}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SaveRequestButton;
