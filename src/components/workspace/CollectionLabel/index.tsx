import { useRequest } from 'ahooks';
import { App, Button, Popconfirm, Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { FC, useRef } from 'react';

import { CollectionService } from '../../../services/Collection.service';
import { Label } from '../../../services/Collection.type';
import { useStore } from '../../../store';
import LabelEditor, { LabelEditorProps, LabelEditorRef } from './LabelEditor';

const CollectionLabel: FC = () => {
  const { message } = App.useApp();

  const { activeWorkspaceId } = useStore();
  const createAndUpdateRef = useRef<LabelEditorRef>(null);

  const columns: ColumnsType<Label> = [
    {
      title: 'LabelName',
      dataIndex: 'labelName',
      key: 'labelName',
      render(labelName, record) {
        return <Tag color={record.color}>{labelName}</Tag>;
      },
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
    },
    {
      title: 'Action',
      render(_, record) {
        return (
          <Space>
            <Button size='small' onClick={() => createAndUpdateRef.current?.showModal(record)}>
              Edit
            </Button>

            <Popconfirm
              title='Are you sure to delete this label?'
              onConfirm={() => {
                labelRemoveRun({
                  workspaceId: activeWorkspaceId,
                  id: record.id,
                });
              }}
              okText='Yes'
              cancelText='No'
            >
              <Button danger size='small'>
                Delete
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
      message.error('delete error');
    },
  });

  const { run: labelSaveRun } = useRequest(CollectionService.saveLabels, {
    manual: true,
    onSuccess() {
      message.success('update successfully');
      queryLabels();
    },
    onError() {
      message.error('update error');
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
