import { CheckOutlined, UploadOutlined } from '@ant-design/icons';
import { useTranslation } from '@arextest/arex-core';
import { App, Button, Form, FormProps, Input, Modal, Table, Upload } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useMemo, useState } from 'react';

export type DataMaskingType = {
  type: string;
  name: string;
  uploadTime: string;
};

const DataDescription = () => {
  const { message } = App.useApp();
  const { t } = useTranslation();
  const [openUploadModal, setOpenUploadModal] = useState(false);

  const columns: ColumnsType<DataMaskingType> = useMemo(
    () => [
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: 'jar包名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '上传时间',
        dataIndex: 'uploadTime',
        key: 'uploadTime',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (_, record) => (
          <Button type='link' onClick={() => handleDelete(record)}>
            删除
          </Button>
        ),
      },
    ],
    [],
  );

  const handleDelete = (record: DataMaskingType) => {
    console.log('delete', record);
  };

  const handleUpload: FormProps['onFinish'] = (value) => {
    console.log(value);
  };

  return (
    <div>
      <div style={{ float: 'right', margin: '16px 0' }}>
        <Button type='primary' onClick={() => setOpenUploadModal(true)}>
          上传
        </Button>
      </div>

      <Table
        size='small'
        columns={columns}
        dataSource={[
          {
            type: 'MD5加解密',
            name: 'MD5Cryption.jar',
            uploadTime: '2021-08-01 12:00:00',
          },
          {
            type: 'SHA1加解密',
            name: 'SHA1Cryption.jar',
            uploadTime: '2021-08-01 12:00:00',
          },
        ]}
      />

      <Modal
        destroyOnClose
        open={openUploadModal}
        title={'脱敏jar包上传'}
        footer={false}
        onCancel={() => setOpenUploadModal(false)}
      >
        <Form
          name='jar-upload-form'
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          onFinish={handleUpload}
          style={{ marginTop: '16px' }}
        >
          <Form.Item
            label={'名称'}
            name='name'
            rules={[{ required: true, message: 'Please input data masking jar name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={'脱敏jar包文件'}
            name='jar'
            rules={[{ required: true, message: 'Please upload data masking jar file!' }]}
          >
            <Upload
              beforeUpload={(file) => {
                const isJar = file.type === 'application/java-archive';
                if (!isJar) message.error(`${file.name} is not a png file`);
                return isJar || Upload.LIST_IGNORE;
              }}
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item style={{ display: 'flex', flexDirection: 'row-reverse' }}>
            <Button type='primary' icon={<CheckOutlined />} htmlType='submit'>
              {t('ok', { ns: 'common' })}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DataDescription;
