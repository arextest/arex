import { Button, Form, Input, Modal, TreeSelect, Typography } from 'antd';
import React, { FC, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ContentTypeEnum } from '../../../constant';
import { treeFindPath } from '../../../helpers/collection/util';
import { CollectionService } from '../../../services/CollectionService';
import { FileSystemService } from '../../../services/FileSystem.service';
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
    headers: requestHeaders;
    params: requestParams;
    preRequestScript: unknown;
    testScript: unknown;
  };
  collectionTreeData: any;
  onSaveAs: any;
};
const SaveRequestButton: FC<SaveRequestButtonProps> = ({
  reqParams,
  collectionTreeData,
  onSaveAs,
}) => {
  const _useParams = useParams();
  const [form] = Form.useForm();
  const [value, setValue] = useState<string>();
  const [visible, setVisible] = useState<boolean>(false);

  const onChange = (newValue: string) => {
    setValue(newValue);
  };

  // 深度优先遍历

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
      <Button onClick={() => setVisible(true)}>Save As</Button>
      <Modal
        visible={visible}
        title='SAVE REQUEST'
        okText='Create'
        cancelText='Cancel'
        onCancel={() => setVisible(false)}
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
                userName: localStorage.getItem('email'),
              }).then((res) => {
                FileSystemService.saveInterface({
                  ...reqParams,
                  id: res.body.infoId,
                }).then((r) => {
                  // 通知父组件
                  onSaveAs({
                    key: res.body.infoId,
                    title: values.requestName,
                  });
                  setVisible(false);
                  form.resetFields();
                });
              });
              // onCreate(values);
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

export default SaveRequestButton;
