import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Button, Form, Input, message, Modal, Popconfirm, Table, Tag } from 'antd';
import { Divider } from 'antd/lib';
import React from 'react';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { CirclePicker } from 'react-color';
import { useParams } from 'react-router-dom';

import request from '../../helpers/api/axios';

const labelColors = [
  '#b60205',
  '#d93f0b',
  '#fbca04',
  '#0e8a16',
  '#006b75',
  '#1d76db',
  '#0052cc',
  '#5319e7',
  '#e99695',
  '#f9d0c4',
  '#fef2c0',
  '#c2e0c6',
  '#bfdadc',
  '#c5def5',
  '#bfd4f2',
  '#d4c5f9',
];

const CreateAndUpdate = forwardRef(({ onOk }: any, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      showModal: showModal,
    };
  });
  const [form] = Form.useForm();

  const showModal = (initFormValue: any) => {
    form.setFieldsValue({
      id: initFormValue.id,
      labelName: initFormValue.labelName,
      color: initFormValue.color || '',
    });
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const nameValue = Form.useWatch('color', form)?.hex || '';

  return (
    <div>
      <div
        css={css`
          display: flex;
          padding: 10px 0;
        `}
      >
        <div></div>
        <Button type='primary' onClick={showModal}>
          New Label
        </Button>
      </div>
      <Modal
        title='Labels'
        open={isModalOpen}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              onOk(values);
              handleOk();
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
        onCancel={handleCancel}
      >
        <Form form={form} layout='vertical' name='form_in_modal'>
          <Tag color={nameValue}>Label preview</Tag>
          <div
            css={css`
              margin: 10px 0px;
            `}
          />
          <Form.Item
            css={css`
              display: none;
            `}
            name='id'
            label='Id'
          >
            <Input />
          </Form.Item>
          <Form.Item name='labelName' label='Label Name'>
            <Input />
          </Form.Item>
          <Form.Item
            name='color'
            label='Color'
            valuePropName={'color'}
            trigger={'onChangeComplete'}
          >
            <CirclePicker
              circleSize={20}
              colors={labelColors}
              onChangeComplete={(color) => {
                return color.hex;
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

const CollectionLabCustom = () => {
  const params = useParams();
  const createAndUpdateRef = useRef(null);
  const columns = [
    {
      title: 'Labe lName',
      dataIndex: 'labelName',
      key: 'labelName',
      render(_: any, record: any) {
        return <Tag color={record.color}>{_}</Tag>;
      },
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render(_: any, record: any) {
        return (
          <div>
            <Button
              onClick={() => {
                // @ts-ignore
                createAndUpdateRef.current.showModal(record);
              }}
            >
              Edit
            </Button>
            <Divider type={'vertical'} />

            <Popconfirm
              title='Are you sure to delete this label?'
              onConfirm={() => {
                labelRemoveRun({
                  labelId: record.id,
                });
              }}
              okText='Yes'
              cancelText='No'
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const { data, run } = useRequest<{ id: string; labelName: string; color: string }[], any>(() =>
    request
      .post('/api/label/queryLabelsByWorkspaceId', {
        workspaceId: params.workspaceId,
      })
      // @ts-ignore
      .then((r) => r.body.labels),
  );

  const { data: labelRemoveResData, run: labelRemoveRun } = useRequest(
    (p) =>
      request
        .post('/api/label/remove', {
          workspaceId: params.workspaceId,
          labelId: p.labelId,
        })
        // @ts-ignore
        .then((r) => r.body.labels),
    {
      manual: true,
      onSuccess(res) {
        run();
        // console.log(res.body.labels);
      },
      onError() {
        message.error('delete error');
      },
    },
  );

  const { data: labelSaveResData, run: labelSaveRun } = useRequest(
    (p) =>
      request
        .post('/api/label/save', p)
        // @ts-ignore
        .then((r) => r.body.labels),
    {
      manual: true,
      onSuccess(res) {
        run();
        // console.log(res.body.labels);
      },
    },
  );
  return (
    <div>
      <CreateAndUpdate
        onOk={(p: any) => {
          labelSaveRun({
            id: p.id,
            workspaceId: params.workspaceId,
            labelName: p.labelName,
            color: p.color.hex,
          });
        }}
        ref={createAndUpdateRef}
      />
      <Table size='small' rowKey={'id'} dataSource={data} columns={columns} />
    </div>
  );
};

export default CollectionLabCustom;
