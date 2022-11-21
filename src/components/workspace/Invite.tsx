import { UserAddOutlined } from '@ant-design/icons';
import { Button, Form, message, Modal, Select, Space, Typography } from 'antd';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { RoleEnum } from '../../constant';
import WorkspaceService from '../../services/Workspace.service';
import { useStore } from '../../store';
const { Text } = Typography;

const { Option } = Select;

const InviteWorkspace = () => {
  const _useParams = useParams();
  const [form] = Form.useForm();
  const {
    userInfo: { email },
  } = useStore();
  const [open, setOpen] = useState<boolean>(false);

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  return (
    <>
      <Button
        style={{ marginRight: '8px' }}
        type={'primary'}
        size={'small'}
        icon={<UserAddOutlined />}
        onClick={() => setOpen(true)}
      >
        Invite
      </Button>

      <Modal
        open={open}
        title='Invite people to this workspace'
        okText='Send Invites'
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              console.log(values, 'va');
              const params = {
                invitor: email,
                role: values.role,
                userNames: values.email,
                workspaceId: _useParams.workspaceId,
              };
              WorkspaceService.inviteToWorkspace(params).then((res) => {
                const successUsers = res.body.successUsers;
                const failedUsers = res.body.failedUsers;
                const successMsg =
                  successUsers.length > 0 ? `${successUsers.join('、')} Invitation succeeded.` : '';
                const failedMsg =
                  failedUsers.length > 0 ? `${failedUsers.join('、')} Invitation failed.` : '';
                message.info(`${successMsg} ${failedMsg}`);
                setOpen(false);
              });
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
        onCancel={() => setOpen(false)}
      >
        <Form
          form={form}
          layout='vertical'
          name='form_in_modal'
          initialValues={{
            email: [],
            role: RoleEnum.Admin,
          }}
        >
          <Form.Item
            name='email'
            label='Email'
            rules={[
              {
                required: true,
                message: 'Please input email!',
              },
            ]}
          >
            <Select mode='tags' style={{ width: '100%' }} onChange={handleChange}></Select>
          </Form.Item>

          <Form.Item name='role' label='Role'>
            <Select placeholder='Select a option and change input text above'>
              <Option value={RoleEnum.Admin}>
                <Space direction='vertical'>
                  <Text>Admin</Text>
                  <Text type='secondary'>Can manage workspace details and members.</Text>
                </Space>
              </Option>
              <Option value={RoleEnum.Editor}>
                <Space direction='vertical'>
                  <Text>Editor</Text>
                  <Text type='secondary'>Can create and edit workspace resources.</Text>
                </Space>
              </Option>
              <Option value={RoleEnum.Viewer}>
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
