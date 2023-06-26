import { UserOutlined } from '@ant-design/icons';
import { getLocalStorage, RoleEnum, useTranslation } from '@arextest/arex-core';
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
  Select,
  Space,
  Typography,
} from 'antd';
import React, { useMemo } from 'react';
import { FC } from 'react';

import { EMAIL_KEY } from '@/constant';
import { FileSystemService } from '@/services';
import { useMenusPanes, useWorkspaces } from '@/store';

const { Text } = Typography;

const WorkspaceSetting: FC = () => {
  const { message } = App.useApp();
  const { t } = useTranslation(['components', 'common']);

  const { workspaces, activeWorkspaceId, getWorkspaces } = useWorkspaces();

  const { reset: resetPane } = useMenusPanes();
  const userName = getLocalStorage<string>(EMAIL_KEY) as string;

  const roleOptions = useMemo(
    () => [
      {
        label: t('workSpace.admin'),
        value: RoleEnum.Admin,
      },
      {
        label: t('workSpace.editor'),
        value: RoleEnum.Editor,
      },
      {
        label: t('workSpace.viewer'),
        value: RoleEnum.Viewer,
      },
    ],
    [t],
  );

  const { run: renameWorkspace } = useRequest(
    (workspaceName) =>
      FileSystemService.renameWorkspace({
        id: activeWorkspaceId as string,
        workspaceName,
        userName,
      }),
    {
      manual: true,
      onSuccess(success) {
        if (success) {
          message.success(t('success'));
          getWorkspaces();
        }
      },
    },
  );

  const onFinish = (values: { workspaceName: string }) => {
    renameWorkspace(values.workspaceName);
  };

  const { data: workspaceUsers = [], run: queryUsersByWorkspace } = useRequest(
    () => FileSystemService.queryUsersByWorkspace({ workspaceId: activeWorkspaceId as string }),
    {
      ready: !!activeWorkspaceId,
    },
  );

  const isAdmin = useMemo(
    () => workspaceUsers.find((user) => user.userName === userName)?.role === RoleEnum.Admin,
    [userName, workspaceUsers],
  );

  const { run: changeRole } = useRequest(
    (params: { userName: string; role: number }) =>
      FileSystemService.changeRole({
        ...params,
        workspaceId: activeWorkspaceId as string,
      }),
    {
      manual: true,
      ready: !!activeWorkspaceId,
      onSuccess(res) {
        if (!res.responseCode) {
          queryUsersByWorkspace();
          message.success(res.responseDesc);
        } else {
          message.error(res.responseDesc);
        }
      },
    },
  );

  const { run: removeUserFromWorkspace } = useRequest(
    (params: { userName: string }) =>
      FileSystemService.removeUserFromWorkspace({
        ...params,
        workspaceId: activeWorkspaceId as string,
      }),
    {
      manual: true,
      ready: !!activeWorkspaceId,
      onSuccess(res) {
        if (!res.responseCode) {
          queryUsersByWorkspace();
          message.success(res.responseDesc);
        } else {
          message.error(res.responseDesc);
        }
      },
    },
  );

  const resetWorkspaces = () => {
    // TODO workspaces[0] 可能无效
    getWorkspaces(workspaces[0].id);
    resetPane();
  };

  const { run: leaveWorkspace } = useRequest(
    () =>
      FileSystemService.leaveWorkspace({
        workspaceId: activeWorkspaceId as string,
      }),
    {
      manual: true,
      ready: !!activeWorkspaceId,
      onSuccess(success) {
        if (success) {
          message.success(t('message.leaveSuccess', { ns: 'common' }));
          resetWorkspaces();
        } else {
          message.error(t('message.leaveFailed', { ns: 'common' }));
        }
      },
    },
  );

  const { run: deleteWorkspace } = useRequest(
    () =>
      FileSystemService.deleteWorkspace({
        workspaceId: activeWorkspaceId as string,
        userName: userName as string,
      }),
    {
      manual: true,
      ready: !!activeWorkspaceId,
      onSuccess(success) {
        if (success) {
          message.success(t('message.delSuccess', { ns: 'common' }));
          resetWorkspaces();
        } else {
          message.error(t('message.delFailed', { ns: 'common' }));
        }
      },
    },
  );

  return (
    <div>
      <div style={{ width: '440px', margin: '0 auto' }}>
        <h1>{t('workSpace.workspaceSettings')}</h1>
        <Form
          layout='inline'
          name='basic'
          initialValues={{
            workspaceName: workspaces.find((workspace) => workspace.id === activeWorkspaceId)
              ?.workspaceName,
          }}
          onFinish={onFinish}
          autoComplete='off'
        >
          <Form.Item
            label={t('workSpace.name')}
            name='workspaceName'
            rules={[{ required: true, message: t('workSpace.emptyName') as string }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit'>
              {t('workSpace.update')}
            </Button>
          </Form.Item>
        </Form>
        <Divider />

        <List
          itemLayout='horizontal'
          dataSource={workspaceUsers}
          locale={{ emptyText: t('workSpace.noInvitedUser') }}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Select
                  bordered={false}
                  key='userRole'
                  disabled={!isAdmin}
                  value={item.role}
                  options={roleOptions}
                  onSelect={(role) => {
                    changeRole({ role, userName: item.userName });
                  }}
                />,
              ].concat(
                item.userName !== userName && isAdmin ? (
                  <Popconfirm
                    key='moveOut'
                    title={t('workSpace.moveOut')}
                    description={t('workSpace.moveOutTip')}
                    onConfirm={() => removeUserFromWorkspace({ userName: item.userName })}
                    okText={t('yes', { ns: 'common' })}
                    cancelText={t('no', { ns: 'common' })}
                  >
                    <Button danger type='link'>
                      {t('workSpace.moveOut')}
                    </Button>
                  </Popconfirm>
                ) : (
                  []
                ),
              )}
            >
              <List.Item.Meta
                avatar={<Avatar>{item.userName?.[0]}</Avatar>}
                title={
                  <Space>
                    <Typography.Text>{item.userName}</Typography.Text>
                    <Typography.Text type='secondary'>
                      {userName === item.userName && <UserOutlined />}
                    </Typography.Text>
                  </Space>
                }
                description={
                  {
                    '1': t('workSpace.notAccepted'),
                    '2': t('workSpace.accepted'),
                  }[item.status]
                }
              />
            </List.Item>
          )}
        />

        <Divider />
        <Space direction='vertical'>
          <Text>{t('workSpace.leave')}</Text>

          <Popconfirm
            title={t('workSpace.leave')}
            description={t('workSpace.leaveTip')}
            onConfirm={leaveWorkspace}
            okText={t('yes', { ns: 'common' })}
            cancelText={t('no', { ns: 'common' })}
          >
            <Button danger>{t('workSpace.leave')}</Button>
          </Popconfirm>
        </Space>

        <Divider />

        <Space direction='vertical'>
          <Text>{t('workSpace.del')}</Text>
          <Text type='secondary'>{t('workSpace.delMessage')}</Text>

          {/* TODO input workspace name to confirm delete workspace */}
          <Popconfirm
            title={t('workSpace.del')}
            description={t('workSpace.delConfirmText')}
            onConfirm={deleteWorkspace}
            okText={t('yes', { ns: 'common' })}
            cancelText={t('no', { ns: 'common' })}
          >
            <Button danger>{t('workSpace.del')}</Button>
          </Popconfirm>
        </Space>
      </div>
    </div>
  );
};

export default WorkspaceSetting;
