import { InboxOutlined } from '@ant-design/icons';
import { Segmented, useTranslation } from '@arextest/arex-core';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useRequest } from 'ahooks';
import { Button, message, Modal, Radio, RadioChangeEvent, Upload } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

import { FileSystemService } from '@/services';
import { useCollections } from '@/store';
import { download } from '@/utils';

import useWorkspaces from '../../store/useWorkspaces';

export interface CollectionsImportExportProps {
  onCancel?: () => void;
}

export interface CollectionsImportExportRef {
  open: () => void;
}

enum Format {
  AREX = 1,
  POSTMAN = 2,
}

enum Type {
  IMPORT,
  EXPORT,
}

const CollectionsImportExport = forwardRef<
  CollectionsImportExportRef,
  CollectionsImportExportProps
>(({ onCancel }, ref) => {
  const { getCollections } = useCollections();
  const { activeWorkspaceId } = useWorkspaces();
  const { t } = useTranslation(['components']);

  const [wrapperRef] = useAutoAnimate();

  const [open, setOpen] = useState(false);
  useImperativeHandle(ref, () => ({ open: () => setOpen(true) }), []);

  const [type, setType] = useState<Type>(Type.IMPORT);
  const [format, setFormat] = useState<Format>(Format.AREX);

  const [fileString, setFileString] = useState('');

  const { run: importCollection } = useRequest(
    () =>
      FileSystemService.importCollection({
        workspaceId: activeWorkspaceId,
        type: format,
        importString: fileString,
      }),
    {
      manual: true,
      onSuccess() {
        message.success(t('workSpace.importSuccess'));
        setOpen(false);
        getCollections();
      },
      onError() {
        message.error(t('workSpace.importFailed'));
      },
    },
  );

  const onChange = (e: RadioChangeEvent) => {
    setFormat(e.target.value);
  };

  const { run: exportCollection } = useRequest(
    () =>
      FileSystemService.exportCollection({
        workspaceId: activeWorkspaceId,
        type: format,
      }),
    {
      manual: true,
      onSuccess(res) {
        download(res, `${activeWorkspaceId}.json`);
        setOpen(false);
      },
    },
  );

  return (
    <Modal
      destroyOnClose
      title={
        <Segmented
          value={type}
          options={[
            {
              label: t('collection.import'),
              value: Type.IMPORT,
            },
            {
              label: t('collection.export'),
              value: Type.EXPORT,
            },
          ]}
          onChange={(type) => {
            setType(type as Type);
            if (format === Format.POSTMAN) setFormat(Format.AREX);
          }}
        />
      }
      width={400}
      open={open}
      onCancel={() => {
        setOpen(false);
        onCancel?.();
      }}
      footer={false}
    >
      <div ref={wrapperRef}>
        <Radio.Group
          key='importExportType'
          onChange={onChange}
          value={format}
          options={[
            {
              label: 'AREX',
              value: Format.AREX,
            },
            {
              label: 'Postman',
              value: Format.POSTMAN,
              disabled: type === Type.EXPORT, // 暂只支持 arex 导出
            },
          ]}
          style={{ margin: '8px 0' }}
        />

        {type === Type.IMPORT && (
          <Upload.Dragger
            key='upload'
            listType={'text'}
            maxCount={1}
            beforeUpload={async (file) => file.text().then((text) => setFileString(text))}
          >
            <p className='ant-upload-drag-icon'>
              <InboxOutlined />
            </p>
            <p className='ant-upload-text'>Click or drag file to upload</p>
          </Upload.Dragger>
        )}

        <Button
          block
          key='action'
          type={'primary'}
          onClick={type === Type.IMPORT ? importCollection : exportCollection}
          style={{ marginTop: '16px' }}
        >
          {type === Type.IMPORT ? t('collection.import') : t('collection.export')}
        </Button>
      </div>
    </Modal>
  );
});

export default CollectionsImportExport;
