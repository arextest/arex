import { Button, Divider, Form, Input, Popconfirm, Space, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

import { WorkspaceService } from '../services/Workspace.service';
import { useStore } from '../store';

const { Text } = Typography;

const WorkspaceOverview = () => {
  const params = useParams();
  const nav = useNavigate();
  const { workspaces, resetPanes } = useStore();

  const onFinish = (values: any) => {
    WorkspaceService.renameWorkspace({
      workspaceId: params.workspaceId,
      newName: values.name,
      userName: localStorage.getItem('email'),
    }).then((res) => {
      window.location.href = `/${params.workspaceId}/workspace/${values.name}`;
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div>
      <div style={{ width: '440px', margin: '0 auto' }}>
        <h1>Workspace settings</h1>
        <Form
          layout='vertical'
          name='basic'
          initialValues={{ name: params.workspaceName }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <Form.Item
            label='Name'
            name='name'
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Update
            </Button>
          </Form.Item>
        </Form>

        <Divider />

        <Space direction='vertical'>
          <Text>Delete workspace</Text>
          <Text type='secondary'>
            Once deleted, a workspace is gone forever along with its data.
          </Text>

          <Popconfirm
            title='Are you sure to delete this workspace?'
            onConfirm={() => {
              WorkspaceService.deleteWorkspace({ workspaceId: params.workspaceId }).then((res) => {
                resetPanes();
                nav(
                  `/${workspaces[0].id}/workspace/${workspaces[0].workspaceName}/workspaceOverview/${workspaces[0].id}`,
                );
              });
            }}
            okText='Yes'
            cancelText='No'
          >
            <Button type={'danger'}>Delete Workspace</Button>
          </Popconfirm>
        </Space>
      </div>
    </div>
  );
};

export default WorkspaceOverview;
