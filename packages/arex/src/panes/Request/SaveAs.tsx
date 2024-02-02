import { getLocalStorage, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Input, Modal, Typography } from 'antd';
import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react';

import { CollectionSelect } from '@/components';
import { CollectionNodeType, EMAIL_KEY } from '@/constant';
import { FileSystemService } from '@/services';
import { useCollections } from '@/store';

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
  const { t } = useTranslation('components');
  const { message } = App.useApp();
  const userName = getLocalStorage<string>(EMAIL_KEY);

  const [value, setValue] = useState(props.title);

  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const { collectionsFlatData, getPath } = useCollections();
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
      onSuccess: (res) => {
        console.log('ok');
        setOpen(false);
        props.onCreate?.(res.infoId);
      },
    },
  );

  const handleSaveAs = () => {
    if (!selectedKeys?.length) return message.info(t('http.selectSaveLocation'));

    const node = collectionsFlatData.get(selectedKeys[selectedKeys.length - 1].toString());
    if (!node) return;
    if (props.nodeType === CollectionNodeType.case && node.nodeType === CollectionNodeType.folder)
      return message.info(t('http.selectInterface'));

    addCollectionItem({
      nodeName: value || props.title || t('untitled', { ns: 'common' }),
      nodeType: props.nodeType,
      parentPath: collectionPath.map((i) => i.id),
    });
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
        <Typography.Text type='secondary'>{t('http.title')}</Typography.Text>
        <Input
          defaultValue={props.title}
          placeholder={props.title}
          onChange={(e) => setValue(e.currentTarget.value)}
        />
      </div>

      <div>
        <Typography.Text type='secondary'>{t('http.selectLocation')}</Typography.Text>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ marginRight: '4px' }}>{t('http.saveTo')}</span>
          <Typography.Text type='secondary'>
            {collectionPath.map((path) => path.name).join(' / ')}
          </Typography.Text>
        </div>

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
