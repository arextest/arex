import { UserOutlined } from '@ant-design/icons';
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
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { EmailKey, RoleEnum } from '../../constant';
import { getLocalStorage } from '../../helpers/utils';
import WorkspaceService from '../../services/Workspace.service';
import { useStore } from '../../store';

const { Text } = Typography;

const WorkspaceSetting: FC = () => {
  const { message } = App.useApp();
  const { t } = useTranslation(['components', 'common']);

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

  const onFinish = (values: any) => {
    WorkspaceService.renameWorkspace({
      workspaceId: params.workspaceId,
      newName: values.name,
      userName,
    }).then(() => {
      window.location.href = `/${params.workspaceId}`;
    });
  };

  const { data: workspaceUsers = [], run: queryUsersByWorkspace } = useRequest(() =>
    WorkspaceService.queryUsersByWorkspace({ workspaceId: activeWorkspaceId }),
  );

  const isAdmin = useMemo(
    () => workspaceUsers.find((user) => user.userName === userName)?.role === RoleEnum.Admin,
    [userName, workspaceUsers],
  );

  const { run: changeRole } = useRequest(
    (params: { userName: string; role: number }) =>
      WorkspaceService.changeRole({
        ...params,
        workspaceId: activeWorkspaceId,
      }),
    {
      manual: true,
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
      WorkspaceService.removeUserFromWorkspace({
        ...params,
        workspaceId: activeWorkspaceId,
      }),
    {
      manual: true,
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
    setWorkspacesLastManualUpdateTimestamp(new Date().getTime());
    resetPage();
    // TODO workspaces[0] 可能无效
    setActiveWorkspaceId(workspaces[0].id);
    nav(`/${workspaces[0].id}/workspaceOverview/${workspaces[0].id}`);
  };

  const { run: leaveWorkspace } = useRequest(
    () =>
      WorkspaceService.leaveWorkspace({
        workspaceId: activeWorkspaceId,
      }),
    {
      manual: true,
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
      WorkspaceService.deleteWorkspace({
        workspaceId: activeWorkspaceId,
        userName: userName as string,
      }),
    {
      manual: true,
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
            name: workspaces.find((workspace) => workspace.id === params.workspaceId)
              ?.workspaceName,
          }}
          onFinish={onFinish}
          autoComplete='off'
        >
          <Form.Item
            label={t('workSpace.name')}
            name='name'
            rules={[{ required: true, message: t('workSpace.emptyName') }]}
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
