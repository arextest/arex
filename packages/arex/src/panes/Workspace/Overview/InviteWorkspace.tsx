import { UserAddOutlined } from '@ant-design/icons';
import { getLocalStorage, RoleEnum, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Button, Form, Modal, Select, Space, Typography } from 'antd';
import React, { FC, useState } from 'react';

import { EMAIL_KEY } from '@/constant';
import { FileSystemService } from '@/services';
import { useWorkspaces } from '@/store';
const { Text } = Typography;

const { Option } = Select;

export type InviteWorkspaceProps = {
  onInvite?: () => void;
};

const InviteWorkspace: FC<InviteWorkspaceProps> = (props) => {
  const { message } = App.useApp();
  const { t } = useTranslation('components');
  const email = getLocalStorage<string>(EMAIL_KEY);
  const { activeWorkspaceId } = useWorkspaces();

  const [open, setOpen] = useState<boolean>(false);

  const { run: inviteToWorkspace, loading } = useRequest(FileSystemService.inviteToWorkspace, {
    manual: true,
    onSuccess: (res) => {
      const successUsers = res.successUsers;
      const failedUsers = res.failedUsers;
      const successMsg =
        successUsers.length > 0
          ? `${successUsers.join('、')} ${t('workSpace.inviteSuccessful')}.`
          : '';
      const failedMsg =
        failedUsers.length > 0
          ? `${failedUsers.join('、')} ${t('workSpace.invitationFailed')}.`
          : '';

      message.info(`${successMsg} ${failedMsg}`);
      res.failReason && message.warning(res.failReason);

      successUsers.length && props.onInvite?.();
    },
    onError: (err: Error) => {
      // @ts-ignore
      message.error(err?.responseDesc);
    },
    onFinally: () => {
      setOpen(false);
    },
  });

  const handleInvite = (values: { email: string[]; role: RoleEnum }) => {
    const params = {
      invitor: email as string,
      role: values.role,
      userNames: values.email,
      workspaceId: activeWorkspaceId,
      arexUiUrl: `${window.location.protocol}//${window.location.host}`,
    };
    inviteToWorkspace(params);
  };

  return (
    <>
      <Button
        size='small'
        type='primary'
        icon={<UserAddOutlined />}
        onClick={() => setOpen(true)}
        style={{ marginRight: '8px' }}
      >
        {t('workSpace.invite')}
      </Button>

      <Modal
        destroyOnClose
        open={open}
        title={t('workSpace.inviteTitle')}
        footer={false}
        onCancel={() => setOpen(false)}
      >
        <Form
          layout='vertical'
          name='form_in_modal'
          initialValues={{
            role: RoleEnum.Editor,
          }}
          onFinish={handleInvite}
        >
          <Form.Item rules={[{ required: true }]} name='email' label={t('workSpace.email')}>
            <Select
              mode='tags'
              open={false}
              tokenSeparators={[',', 'enter']}
              placeholder={t('workSpace.enterInviteeEmail')}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item name='role' label={t('workSpace.role')}>
            <Select>
              <Option value={RoleEnum.Admin}>
                <Space direction='vertical'>
                  <Text>{t('workSpace.admin')}</Text>
                  <Text type='secondary'>{t('workSpace.adminPermission')}</Text>
                </Space>
              </Option>
              <Option value={RoleEnum.Editor}>
                <Space direction='vertical'>
                  <Text>{t('workSpace.editor')}</Text>
                  <Text type='secondary'>{t('workSpace.editorPermission')}</Text>
                </Space>
              </Option>
              <Option value={RoleEnum.Viewer}>
                <Space direction='vertical'>
                  <Text>{t('workSpace.viewer')}</Text>
                  <Text type='secondary'>{t('workSpace.viewerPermission')}</Text>
                </Space>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' loading={loading} style={{ float: 'right' }}>
              {t('workSpace.sendInvitation')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default InviteWorkspace;
