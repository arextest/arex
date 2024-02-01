import { getLocalStorage, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { Input, Modal, Typography } from 'antd';
import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react';

import { CollectionSelect } from '@/components';
import { CollectionNodeType, EMAIL_KEY } from '@/constant';
import { FileSystemService } from '@/services';
import { useCollections } from '@/store';
const { Text } = Typography;

export type SaveAsProps = {
  title?: string;
  workspaceId: string;
  nodeType: CollectionNodeType;
  onCreate?: (id: string) => void;
};

export type SaveAsRef = {
  open: () => void;
};

const SaveAs = forwardRef<SaveAsRef, SaveAsProps>((props, ref) => {
  const { t } = useTranslation('collection');
  const userName = getLocalStorage<string>(EMAIL_KEY);

  const [value, setValue] = useState(props.title);

  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const { getPath } = useCollections();
  const collectionPath = useMemo(
    () => (selectedKeys.length ? getPath(selectedKeys[0].toString()) : []),
    [getPath, selectedKeys],
  );

  const [open, setOpen] = useState(false);
  useImperativeHandle(
    ref,
    () => ({
      open: () => setOpen(true),
    }),
    [],
  );

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
      onSuccess: (res, [params]) => {
        setOpen(false);
        props.onCreate?.(res.infoId);
      },
    },
  );

  const handleSaveAs = () => {
    if (selectedKeys?.length) {
      // 先添加，再触发 save ！
      addCollectionItem({
        nodeName: value || props.title || 'Untitled',
        nodeType: props.nodeType,
        parentPath: collectionPath.map((i) => i.id),
      });
    }
  };

  return (
    <Modal
      destroyOnClose
      title={t('http.saveAs')}
      open={open}
      onCancel={() => setOpen(false)}
      onOk={handleSaveAs}
    >
      <div style={{ marginBottom: '12px' }}>
        <Typography.Text type='secondary'>名称</Typography.Text>
        <Input
          defaultValue={props.title}
          placeholder={props.title}
          onChange={(e) => setValue(e.currentTarget.value)}
        />
      </div>

      <div>
        <Typography.Text type='secondary'>选择位置</Typography.Text>
        <p>
          <span>Save to </span>
          <Text type='secondary'>{collectionPath.map((path) => path.name).join('/')}</Text>
        </p>
        <CollectionSelect
          // readOnly
          height={560}
          expandable={[CollectionNodeType.folder, CollectionNodeType.interface]}
          selectable={[
            CollectionNodeType.folder,
            props.nodeType === CollectionNodeType.interface
              ? CollectionNodeType.folder
              : CollectionNodeType.interface, // props.nodeType === CollectionNodeType.case
          ]}
          selectedKeys={selectedKeys}
          onSelect={setSelectedKeys}
        />
      </div>
    </Modal>
  );
});

export default SaveAs;
