import { useMount } from 'ahooks';
import { Avatar, Button, Divider, Form, Input, List, Popconfirm, Space, Typography } from 'antd';
import { FC, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { RoleEnum } from '../constant';
import request from '../helpers/api/axios';
import WorkspaceService from '../services/Workspace.service';
import { useStore } from '../store';

const { Text } = Typography;

const WorkspaceOverviewPage: FC = () => {
  const params = useParams();
  const nav = useNavigate();
  const {
    userInfo: { email: userName },
    workspaces,
    resetPanes,
  } = useStore();

  const onFinish = (values: any) => {
    WorkspaceService.renameWorkspace({
      workspaceId: params.workspaceId,
      newName: values.name,
      userName,
    }).then((res) => {
      window.location.href = `/${params.workspaceId}/workspace/${values.name}`;
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const [workspaceUsers, setWorkspaceUsers] = useState([]);

  useMount(() => {
    request
      .post(`/api/filesystem/queryUsersByWorkspace`, {
        workspaceId: params.workspaceId,
      })
      .then((res) => {
        setWorkspaceUsers(res.body.users);
      });
  });

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

        <List
          itemLayout='horizontal'
          dataSource={workspaceUsers}
          renderItem={(item) => (
            <List.Item
              actions={[
                <a key='list-loadmore-edit'>
                  {
                    {
                      [RoleEnum.Admin]: 'Admin',
                      [RoleEnum.Editor]: 'Editor',
                      [RoleEnum.Viewer]: 'Viewer',
                    }[item.role]
                  }
                </a>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src='https://joeschmoe.io/api/v1/random' />}
                title={<span>{item.userName}</span>}
                description={
                  {
                    '1': 'Not accepted',
                    '2': 'Accepted',
                  }[item.status]
                }
              />
            </List.Item>
          )}
        />

        <Divider />

        <Space direction='vertical'>
          <Text>Delete workspace</Text>
          <Text type='secondary'>
            Once deleted, a workspace is gone forever along with its data.
          </Text>

          <Popconfirm
            title='Are you sure to delete this workspace?'
            onConfirm={() => {
              WorkspaceService.deleteWorkspace({ workspaceId: params.workspaceId, userName }).then(
                (res) => {
                  resetPanes();
                  nav(
                    `/${workspaces[0].id}/workspace/${workspaces[0].workspaceName}/workspaceOverview/${workspaces[0].id}`,
                  );
                },
              );
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

export default WorkspaceOverviewPage;
