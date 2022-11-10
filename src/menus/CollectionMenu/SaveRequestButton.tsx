import { Form, Input, Modal, TreeSelect, Typography } from 'antd';
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
        disabled: tree.nodeType !== 3,
        children: haveChildren ? tree.children.map((i) => mapTree(i)) : [],
      };
    };
    return mapTree({ children: collectionTreeData })['children'];
  }, [collectionTreeData]);

  return (
    <>
      <Modal
        open={open}
        title='SAVE REQUEST'
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
                nodeType: 1,
                parentPath: treeFindPath(collectionTreeData, (node) => node.key === value)?.map(
                  (i) => i.key,
                ),
                userName,
              }).then((res) => {
                FileSystemService.saveInterface({
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
          }}
        >
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
