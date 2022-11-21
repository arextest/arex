import { Form, Input, Modal, Select, TreeSelect, Typography } from 'antd';
import { FC, forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ContentTypeEnum } from '../../constant';
import { treeFindPath } from '../../helpers/collection/util';
import { CollectionService } from '../../services/CollectionService';
import { FileSystemService } from '../../services/FileSystem.service';
import { useStore } from '../../store';
const { Text } = Typography;

type SaveRequestButtonProps = {
  reqParams: {
    auth: unknown;
    body: {
      contentType: ContentTypeEnum;
      body: string;
    };
    address: {
      endpoint: string;
      method;
    };
    baseAddress: {
      endpoint: string;
      method;
    };
    testAddress: {
      endpoint: string;
      method;
    };
    headers: any[];
    params: any[];
    preRequestScript: unknown;
    testScript: unknown;
  };
  collectionTreeData: any;
  onSaveAs: any;
};
const SaveRequestButton: FC<SaveRequestButtonProps> = (
  { reqParams, collectionTreeData, onSaveAs },
  ref,
) => {
  const _useParams = useParams();
  const {
    userInfo: { email: userName },
  } = useStore();
  const [form] = Form.useForm();
  const [value, setValue] = useState<string>();
  const [open, setOpen] = useState<boolean>(false);
  const [nodeType, setNodeType] = useState<string>('1');
  const onChange = (newValue: string) => {
    setValue(newValue);
  };

  useImperativeHandle(ref, () => ({
    open: () => {
      setOpen(true);
    },
  }));

  const collectionTreeSelectData = useMemo(() => {
    const mapTree = (tree) => {
      const haveChildren = Array.isArray(tree.children) && tree.children.length > 0;
      return {
        ...tree,
        disabled:
          (tree.nodeType !== 3 && nodeType === '1') || (nodeType === '2' && tree.nodeType !== 1),
        children: haveChildren ? tree.children.map((i) => mapTree(i)) : [],
      };
    };
    return mapTree({ children: collectionTreeData })['children'];
  }, [collectionTreeData, nodeType]);

  return (
    <>
      <Modal
        open={open}
        title={`SAVE ${nodeType === '1' ? 'REQUEST' : 'CASE'}`}
        okText='Create'
        cancelText='Cancel'
        onCancel={() => setOpen(false)}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              CollectionService.addItem({
                id: _useParams.workspaceId,
                nodeName: values.requestName,
                nodeType: values.nodeType,
                parentPath: treeFindPath(collectionTreeData, (node) => node.key === value)?.map(
                  (i) => i.key,
                ),
                userName,
              }).then((res) => {
                const req = {
                  '1': FileSystemService.saveInterface,
                  '2': FileSystemService.saveCase,
                };
                req[values.nodeType]({
                  address: {
                    endpoint: reqParams.endpoint,
                    method: reqParams.method,
                  },
                  body: reqParams.body,
                  headers: reqParams.headers,
                  params: reqParams.params,
                  testScript: reqParams.testScript,
                  testAddress: {
                    endpoint: reqParams.compareEndpoint,
                    method: reqParams.compareMethod,
                  },
                  id: res.body.infoId,
                  workspaceId: _useParams.workspaceId,
                }).then((r) => {
                  // 通知父组件
                  onSaveAs({
                    key: res.body.infoId,
                    title: values.requestName,
                  });
                  setOpen(false);
                  form.resetFields();
                });
              });
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
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
    </>
  );
};

export default forwardRef(SaveRequestButton);
