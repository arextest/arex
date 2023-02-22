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

  const onFinish = (values: any) => {
    WorkspaceService.renameWorkspace({
      workspaceId: params.workspaceId,
      newName: values.name,
      userName,
    }).then(() => {
      window.location.href = `/${params.workspaceId}`;
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
          message.success(t('message.delSuccess', { ns: 'common' }));
          setWorkspacesLastManualUpdateTimestamp(new Date().getTime());
          resetPage();
          setActiveWorkspaceId(workspaces[0].id);
          nav(`/${workspaces[0].id}/workspaceOverview/${workspaces[0].id}`);
        }
      },
    },
  );

  return (
    <div>
      <div style={{ width: '440px', margin: '0 auto' }}>
        <h1>{t('workSpace.workspaceSettings')}</h1>
        <Form
          layout='vertical'
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
                <a key='list-loadmore-edit'>
                  {
                    {
                      [RoleEnum.Admin]: t('workSpace.admin'),
                      [RoleEnum.Editor]: t('workSpace.editor'),
                      [RoleEnum.Viewer]: t('workSpace.viewer'),
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
          <Text>{t('workSpace.del')}</Text>
          <Text type='secondary'>{t('workSpace.delMessage')}</Text>

          <Popconfirm
            title={t('workSpace.delConfirmText')}
            onConfirm={handleDeleteWorkspace}
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
