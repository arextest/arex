import { useRequest } from 'ahooks';
import {
  App,
  Avatar,
  Button,
  Divider,
  Form,
  Input,
  List,
  Popconfirm,
  Space,
  Typography,
} from 'antd';
import React from 'react';
import { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { EmailKey, RoleEnum } from '../../constant';
import { getLocalStorage } from '../../helpers/utils';
import WorkspaceService from '../../services/Workspace.service';
import { useStore } from '../../store';

const { Text } = Typography;

const WorkspaceSetting: FC = () => {
  const { message } = App.useApp();
  const params = useParams();
  const nav = useNavigate();
  const {
    workspaces,
    resetPage,
    activeWorkspaceId,
    setActiveWorkspaceId,
    setWorkspacesLastManualUpdateTimestamp,
  } = useStore();
  const userName = getLocalStorage<string>(EmailKey);

  const onFinish = (values: any) => {
    WorkspaceService.renameWorkspace({
      workspaceId: params.workspaceId,
      newName: values.name,
      userName,
    }).then(() => {
      window.location.href = `/${params.workspaceId}/${values.name}`;
    });
  };

  const { data: workspaceUsers = [] } = useRequest(() =>
    WorkspaceService.queryUsersByWorkspace({ workspaceId: activeWorkspaceId }),
  );

  const { run: handleDeleteWorkspace } = useRequest(
    () =>
      WorkspaceService.deleteWorkspace({
        workspaceId: activeWorkspaceId,
        userName: userName as string,
      }),
    {
      manual: true,
      onSuccess(success) {
        if (success) {
          message.success('delete workspace successfully');
          setWorkspacesLastManualUpdateTimestamp(new Date().getTime());
          resetPage();
          setActiveWorkspaceId(workspaces[0].id);
          nav(
            `/${workspaces[0].id}/${workspaces[0].workspaceName}/workspaceOverview/${workspaces[0].id}`,
          );
        }
      },
    },
  );

  return (
    <div>
      <div style={{ width: '440px', margin: '0 auto' }}>
        <h1>Workspace settings</h1>
        <Form
          layout='vertical'
          name='basic'
          initialValues={{ name: params.workspaceName }}
          onFinish={onFinish}
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
          locale={{ emptyText: 'no invited user' }}
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
                avatar={<Avatar>{item.userName?.[0]}</Avatar>}
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
            onConfirm={handleDeleteWorkspace}
            okText='Yes'
            cancelText='No'
          >
            <Button danger>Delete Workspace</Button>
          </Popconfirm>
        </Space>
      </div>
    </div>
  );
};

export default WorkspaceSetting;
