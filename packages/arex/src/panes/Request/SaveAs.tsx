import { getLocalStorage, useTranslation } from '@arextest/arex-core';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useRequest } from 'ahooks';
import { App, Button, Flex, Input, Modal, theme, Typography } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';

import { CollectionSelect, Icon } from '@/components';
import { CollectionNodeType, EMAIL_KEY } from '@/constant';
import { FileSystemService } from '@/services';
import { useCollections } from '@/store';
import { CaseSourceType } from '@/store/useCollections';

export type SaveAsProps = {
  workspaceId: string;
  nodeType: CollectionNodeType;
  title?: string;
  appName?: string;
  interfaceName?: string;
  operationId?: string;
  recordId?: string;
  defaultPath?: boolean;
  onCreate?: (id: string) => void;
};

export type SaveAsRef = {
  open: (title?: string, options?: Pick<SaveAsProps, 'defaultPath'>) => void;
};

const SaveAs = forwardRef<SaveAsRef, SaveAsProps>((props, ref) => {
  const { t } = useTranslation('components');
  const { token } = theme.useToken();
  const { message } = App.useApp();
  const userName = getLocalStorage<string>(EMAIL_KEY);

  const { collectionsFlatData, getPath } = useCollections();

  const [selectLocationRef] = useAutoAnimate();

  const [defaultPath, setDefaultPath] = useState<boolean | undefined>(props.defaultPath);
  const [value, setValue] = useState(props.title);
  useEffect(() => {
    setValue(props.title);
  }, [props.title]);

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const collectionPath = useMemo(
    () => (selectedKeys.length ? getPath(selectedKeys[0].toString()) : []),
    [getPath, selectedKeys],
  );

  const pathValue = useMemo(
    () =>
      defaultPath
        ? `${props.appName} / ${props.interfaceName} / ${props.title}`
        : collectionPath.map((i) => i.name).join(' / ') || 'Please select a location',
    [collectionPath, defaultPath, props.appName, props.interfaceName, props.title],
  );

  const [open, setOpen] = useState(false);
  useImperativeHandle(
    ref,
    () => ({
      open: (title, options) => {
        setDefaultPath(options?.defaultPath);
        title && setValue(title);
        setOpen(true);
      },
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
        setOpen(false);
        props.onCreate?.(res.infoId);
      },
    },
  );

  const { run: addItemsByAppNameAndInterfaceName } = useRequest(
    FileSystemService.addItemsByAppNameAndInterfaceName,
    {
      manual: true,
      onSuccess(res, [{ nodeName }]) {
        if (res.success) {
          addCollectionItem({
            nodeName: nodeName!,
            nodeType: props.nodeType,
            caseSourceType: CaseSourceType.AREX,
            parentPath: res.path,
          });
        }
      },
    },
  );

  const handleSaveAs = () => {
    if (typeof defaultPath === 'boolean') {
      if (props.operationId && props.recordId) {
        if (!defaultPath && !selectedKeys?.length)
          return message.info(t('http.selectSaveLocation'));
        const params = defaultPath
          ? { appName: props.appName, interfaceName: props.interfaceName, nodeName: props.title }
          : { path: collectionPath.map((i) => i.id) };

        addItemsByAppNameAndInterfaceName({
          recordId: props.recordId,
          workspaceId: props.workspaceId,
          operationId: props.operationId,
          ...params,
        });
      } else {
        message.error(t('http.saveError'));
      }
      return;
    }

    // manual select location to save normal case (not arex case)
    if (!selectedKeys?.length) return message.info(t('http.selectSaveLocation'));

    const node = collectionsFlatData.get(selectedKeys[selectedKeys.length - 1].toString());
    if (!node) return;
    if (props.nodeType === CollectionNodeType.case && node.nodeType === CollectionNodeType.folder)
      return message.info(t('http.selectInterface'));

    const nodeName = value || props.title || (t('untitled', { ns: 'common' }) as string);

    console.log(' props.nodeType', props.nodeType);
    addCollectionItem({
      nodeName,
      nodeType: props.nodeType,
      caseSourceType: props.recordId ? CaseSourceType.AREX : CaseSourceType.CASE,
      parentPath: collectionPath.map((i) => i.id),
    });
  };

  return (
    <Modal
      destroyOnClose
      title={t('http.saveAs')}
      open={open}
      onCancel={() => {
        setOpen(false);
        setValue(undefined);
        setSelectedKeys([]);
      }}
      onOk={handleSaveAs}
    >
      <Typography.Text type='secondary'>{t('http.saveLocation')}</Typography.Text>
      <Flex align='center' style={{ marginBottom: '8px' }}>
        <Typography.Text
          ellipsis
          type={!defaultPath && !selectedKeys.length ? 'secondary' : undefined}
          style={{ flex: 1, borderBottom: `1px solid ${token.colorBorder}` }}
        >
          {pathValue}
        </Typography.Text>
        {typeof defaultPath === 'boolean' && (
          <Button
            icon={
              <Icon
                name='ChevronDown'
                style={{ transform: `rotate(${defaultPath ? 0 : 180}deg)` }}
              />
            }
            onClick={() => {
              setDefaultPath(!defaultPath);
            }}
            style={{ marginLeft: '12px' }}
          />
        )}
      </Flex>

      <div ref={selectLocationRef}>
        {!defaultPath && (
          <>
            <div style={{ marginBottom: '12px' }}>
              <Typography.Text type='secondary'>{t('http.title')}</Typography.Text>
              <Input
                placeholder={props.title}
                value={value}
                onChange={(e) => setValue(e.currentTarget.value)}
              />
            </div>
            <CollectionSelect
              // readOnly
              key='collectionSelect'
              height={560}
              expandable={[CollectionNodeType.folder, CollectionNodeType.interface]}
              selectable={[
                CollectionNodeType.folder,
                props.nodeType === CollectionNodeType.interface
                  ? CollectionNodeType.folder
                  : CollectionNodeType.interface, // props.nodeType === CollectionNodeType.case
              ]}
              selectedKeys={selectedKeys}
              onSelect={(keys) => setSelectedKeys(keys as string[])}
            />
          </>
        )}
      </div>
    </Modal>
  );
});

export default SaveAs;
