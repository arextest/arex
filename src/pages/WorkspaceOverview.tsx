import { Button, Divider, Form, Input, Popconfirm, Space, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

import { WorkspaceService } from '../services/WorkspaceService';
const { Text } = Typography;
const WorkspaceOverviewPage = () => {
  const _useParams = useParams();
  const onFinish = (values: any) => {
    console.log('Success:', values);
    WorkspaceService.renameWorkspace({
      workspaceId: _useParams.workspaceId,
      newName: values.name,
      userName: localStorage.getItem('email')
    }).then((res) => {
      console.log(res);
      window.location.href = `/${_useParams.workspaceId}/workspace/${values.name}`;
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div>
      {/*<div>*/}
      {/*  <h1>Canyon</h1>*/}

      {/*  <div>*/}
      {/*    Workspace Settings*/}
      {/*  </div>*/}
      {/*</div>*/}

      <div style={{ width: '440px', margin: '0 auto' }}>
        {/*<a>*/}
        {/*  Overview*/}
        {/*</a>*/}
        <h1>Workspace settings</h1>

        <Form
          layout='vertical'
          name='basic'
          initialValues={{ name: _useParams.workspaceName }}
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
              WorkspaceService.deleteWorkspace({ workspaceId: _useParams.workspaceId }).then(
                (res) => {
                  console.log(res);
                  window.location.href = '/';
                },
              );
            }}
            onCancel={() => {}}
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

export default WorkspaceOverviewPage;
