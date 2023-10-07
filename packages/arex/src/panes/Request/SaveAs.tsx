import { getLocalStorage } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { Form, Modal, TreeSelect, Typography } from 'antd';
import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react';

import { CollectionNodeType, EMAIL_KEY, PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { FileSystemService } from '@/services';
import { CollectionType } from '@/services/FileSystemService';
import { useCollections } from '@/store';
const { Text } = Typography;

function processTreeData(treeData: CollectionType[], depthLimit = 10, currentDepth = 0) {
  if (currentDepth >= depthLimit) {
    // 达到递归深度上限，停止递归
    return treeData;
  }
  return treeData.map((c) => ({
    title: c.nodeName,
    value: c.infoId,
    disabled: c.nodeType !== CollectionNodeType.folder,
    nodeType: c.nodeType,
    children: processTreeData(c.children || [], depthLimit, currentDepth + 1), // 递归调用，增加当前深度
  }));
}

export type SaveAsProps = {
  workspaceId: string;
};

export type SaveAsRef = {
  open: () => void;
};

const SaveAs = forwardRef<SaveAsRef, SaveAsProps>((props, ref) => {
  const navPane = useNavPane();
  const userName = getLocalStorage<string>(EMAIL_KEY);

  const [open, setOpen] = useState(false);
  useImperativeHandle(
    ref,
    () => ({
      open: () => setOpen(true),
    }),
    [],
  );

  const { collectionsTreeData, getPath } = useCollections();
  const collection = useMemo(
    () =>
      processTreeData(
        collectionsTreeData.filter((item) => item.nodeType !== CollectionNodeType.interface),
      ),
    [collectionsTreeData],
  );

  const [form] = Form.useForm();
  const [value, setValue] = useState<string>();

  const { run: addCollectionItem } = useRequest(
    (params: {
      nodeName: string;
      nodeType: CollectionNodeType;
      caseSourceType?: number;
      parentPath: string[];
    }) =>
      FileSystemService.addCollectionItem({
        ...params,
        userName: userName as string,
        id: props.workspaceId,
      }),
    {
      manual: true,
      onSuccess: (res) => {
        if (res.success) {
          setOpen(false);
          // 保存完跳转
          // httpRef.current?.onSave({ id: res.infoId });
          setTimeout(() => {
            navPane({
              id: res.infoId,
              type: PanesType.REQUEST,
            });
          }, 300);
        }
      },
    },
  );

  const handleSaveAs = ({ savePath }: { savePath: string }) => {
    // 先添加，再触发 save ！
    addCollectionItem({
      nodeName: 'Untitled',
      nodeType: CollectionNodeType.interface,
      parentPath: getPath(savePath).map((i) => i.id),
    });
  };

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      title={'SAVE REQUEST'}
      onOk={() => {
        handleSaveAs(form.getFieldsValue());
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
        <p>
          <span>Save to </span>
          <Text type='secondary'>
            {getPath(value || '')
              .map((path) => path.name)
              .join('/')}
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
            treeData={collection}
            // fieldNames={{ label: 'title', value: 'key' }}
            onChange={setValue}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default SaveAs;
