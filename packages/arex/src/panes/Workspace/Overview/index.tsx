import { DeleteOutlined, LogoutOutlined, SyncOutlined, UserOutlined } from '@ant-design/icons';
import { getLocalStorage, useArexPaneProps, useTranslation } from '@arextest/arex-core';
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

import { EMAIL_KEY, RoleEnum } from '@/constant';
import { FileSystemService } from '@/services';
import { useWorkspaces } from '@/store';
import { decodePaneKey } from '@/store/useMenusPanes';

import InviteWorkspace from './InviteWorkspace';

const { Text } = Typography;

const WorkspaceSetting: FC = () => {
  const { message } = App.useApp();
  const { t } = useTranslation(['components', 'common']);
  const { paneKey } = useArexPaneProps();
  const { id: workspaceId } = decodePaneKey(paneKey);
  const { workspaces, activeWorkspaceId, getWorkspaces } = useWorkspaces();

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
        id: workspaceId as string,
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
    () => FileSystemService.queryUsersByWorkspace({ workspaceId }),
    {
      ready: !!workspaceId,
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
        workspaceId,
      }),
    {
      manual: true,
      ready: !!workspaceId,
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
        workspaceId,
      }),
    {
      manual: true,
      ready: !!workspaceId,
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
    if (workspaceId === activeWorkspaceId) {
      // TODO workspaces[0] 可能无效
      getWorkspaces(workspaces[0].id);
      // resetPane(); // 目前可能存在不同的 workspace pane，所以不能全部关闭
    } else {
      getWorkspaces();
    }
  };

  const { run: leaveWorkspace } = useRequest(
    () =>
      FileSystemService.leaveWorkspace({
        workspaceId,
      }),
    {
      manual: true,
      ready: !!workspaceId,
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
        workspaceId,
        userName: userName as string,
      }),
    {
      manual: true,
      ready: !!workspaceId,
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
            workspaceName: workspaces.find((workspace) => workspace.id === workspaceId)
              ?.workspaceName,
          }}
          onFinish={onFinish}
          autoComplete='off'
        >
          <Form.Item
            label={t('workSpace.name')}
            name='workspaceName'
            rules={[{ required: true, message: t('workSpace.emptyName') }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button icon={<SyncOutlined />} type='primary' htmlType='submit'>
              {t('workSpace.update')}
            </Button>
          </Form.Item>
        </Form>
        <Divider />

        <div>
          <Text style={{ marginRight: '8px' }}>{t('workSpace.inviteTitle')}</Text>
          <InviteWorkspace onInvite={queryUsersByWorkspace} />
        </div>

        <Divider />

        <List
          itemLayout='horizontal'
          dataSource={workspaceUsers}
          locale={{ emptyText: t('workSpace.noInvitedUser') }}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Select
                  variant='borderless'
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
            <Button danger icon={<LogoutOutlined />}>
              {t('workSpace.leave')}
            </Button>
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
            <Button danger icon={<DeleteOutlined />}>
              {t('workSpace.del')}
            </Button>
          </Popconfirm>
        </Space>
      </div>
    </div>
  );
};

export default WorkspaceSetting;
