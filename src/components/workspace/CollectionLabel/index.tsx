import { useRequest } from 'ahooks';
import { App, Button, Popconfirm, Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { CollectionService } from '../../../services/Collection.service';
import { Label } from '../../../services/Collection.type';
import { useStore } from '../../../store';
import LabelEditor, { LabelEditorProps, LabelEditorRef } from './LabelEditor';

const CollectionLabel: FC = () => {
  const { message } = App.useApp();
  const { t } = useTranslation(['common', 'components']);

  const { activeWorkspaceId } = useStore();
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
                  workspaceId: activeWorkspaceId,
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

  const { data: labelData, run: queryLabels } = useRequest(() =>
    CollectionService.queryLabels({ workspaceId: activeWorkspaceId }),
  );

  const { run: labelRemoveRun } = useRequest(CollectionService.removeLabels, {
    manual: true,
    onSuccess() {
      queryLabels();
    },
    onError() {
      message.error(t('delError'));
    },
  });

  const { run: labelSaveRun } = useRequest(CollectionService.saveLabels, {
    manual: true,
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
      workspaceId: activeWorkspaceId,
    });

  return (
    <>
      <LabelEditor onSave={handleSave} ref={createAndUpdateRef} />
      <Table size='small' rowKey='id' dataSource={labelData} columns={columns} />
    </>
  );
};

export default CollectionLabel;
