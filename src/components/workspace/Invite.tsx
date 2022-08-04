import { UserAddOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, Space, Typography } from 'antd';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
const { Text } = Typography;

const { Option } = Select;

const InviteWorkspace = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <>
      <Button
        style={{ marginRight: '8px' }}
        type={'primary'}
        size={'small'}
        icon={<UserAddOutlined />}
        onClick={() => setVisible(true)}
      >
        Invite
      </Button>
      <Modal
        visible={visible}
        title='Invite people to this workspace'
        okText='Create'
        cancelText='Cancel'
        onCancel={() => setVisible(false)}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              console.log(values, 'va');
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        <Form
          form={form}
          layout='vertical'
          name='form_in_modal'
          initialValues={{
            username: 'public',
            role: 'female',
          }}
        >
          <Form.Item
            name='username'
            label='Username'
            rules={[
              {
                required: true,
                message: 'Please input the username of workspace!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name='role' label='Role'>
            <Select placeholder='Select a option and change input text above'>
              <Option value='male'>
                <Space direction='vertical'>
                  <Text>Admin</Text>
                  <Text type='secondary'>Can manage workspace details and members.</Text>
                </Space>
              </Option>
              <Option value='female'>
                <Space direction='vertical'>
                  <Text>Editor</Text>
                  <Text type='secondary'>Can create and edit workspace resources.</Text>
                </Space>
              </Option>
              <Option value='other'>
                <Space direction='vertical'>
                  <Text>Viewer</Text>
                  <Text type='secondary'>Can viewfork,and export workspace resources.</Text>
                </Space>
              </Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default InviteWorkspace;
