import { useRequest } from 'ahooks';
import { App, Button, Popconfirm, Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'arex-core';
import React, { FC, useRef } from 'react';

import { FileSystemService } from '@/services';
import { Label } from '@/services/FileSystemService/label';
import { useWorkspaces } from '@/store';

import LabelEditor, { LabelEditorProps, LabelEditorRef } from './LabelEditor';

const CollectionLabel: FC = () => {
  const { message } = App.useApp();
  const { t } = useTranslation(['common', 'components']);

  const { activeWorkspaceId } = useWorkspaces();
  const createAndUpdateRef = useRef<LabelEditorRef>(null);

  const columns: ColumnsType<Label> = [
    {
      title: t('workSpace.labelName', { ns: 'components' }),
      dataIndex: 'labelName',
      key: 'labelName',
      render(labelName, record) {
        return <Tag color={record.color}>{labelName}</Tag>;
      },
    },
    {
      title: t('workSpace.color', { ns: 'components' }),
      dataIndex: 'color',
      key: 'color',
    },
    {
      title: t('action'),
      render(_, record) {
        return (
          <Space>
            <Button size='small' onClick={() => createAndUpdateRef.current?.showModal(record)}>
              {t('edit')}
            </Button>

            <Popconfirm
              title={t('workSpace.delLabelConfirmText', { ns: 'components' })}
              onConfirm={() => {
                labelRemoveRun({
                  workspaceId: activeWorkspaceId as string,
                  id: record.id,
                });
              }}
              okText={t('yes')}
              cancelText={t('no')}
            >
              <Button danger size='small'>
                {t('delete')}
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const { data: labelData, run: queryLabels } = useRequest(
    () => FileSystemService.queryLabels({ workspaceId: activeWorkspaceId as string }),
    { ready: !!activeWorkspaceId },
  );

  const { run: labelRemoveRun } = useRequest(FileSystemService.removeLabels, {
    manual: true,
    ready: !!activeWorkspaceId,
    onSuccess() {
      queryLabels();
    },
    onError() {
      message.error(t('delError'));
    },
  });

  const { run: labelSaveRun } = useRequest(FileSystemService.saveLabels, {
    manual: true,
    ready: !!activeWorkspaceId,
    onSuccess() {
      message.success(t('updateSuccess'));
      queryLabels();
    },
    onError() {
      message.error(t('updateError'));
    },
  });

  const handleSave: LabelEditorProps['onSave'] = ({ id, labelName, color }) =>
    labelSaveRun({
      id,
      color,
      labelName,
      workspaceId: activeWorkspaceId as string,
    });

  return (
    <>
      <LabelEditor onSave={handleSave} ref={createAndUpdateRef} />
      <Table size='small' rowKey='id' dataSource={labelData} columns={columns} />
    </>
  );
};

export default CollectionLabel;
