import { SpaceBetweenWrapper, useTranslation } from '@arextest/arex-core';
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { App, Button, Collapse, Input, Modal, Typography } from 'antd';
import React, { FC, useState } from 'react';

import { ApplicationService } from '@/services';

export interface SettingOtherProps {
  appId: string;
}

const SettingOther: FC<SettingOtherProps> = (props) => {
  const { t } = useTranslation(['components', 'common']);
  const { message } = App.useApp();

  const [confirmAppIdValue, setConfirmAppIdValue] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [confirmInputStatus, setConfirmInputStatus] = useState<'error' | 'warning'>();

  const { run: deleteApplication } = useRequest(ApplicationService.deleteApplication, {
    manual: true,
    onSuccess: (success) => {
      if (success) {
        handleCancelDelete();
        message.success(t('message.delSuccess', { ns: 'common' }));
      } else message.error(t('message.delFailed', { ns: 'common' }));
    },
  });

  function handleCancelDelete() {
    setConfirmDeleteOpen(false);
    setConfirmAppIdValue('');
    setConfirmInputStatus(undefined);
  }

  function handleConfirmDelete() {
    const valid = confirmAppIdValue.trim() === props.appId;
    if (valid) {
      deleteApplication({ appId: props.appId });
    } else {
      setConfirmInputStatus('error');
    }
  }

  function handleConfirmChange(e: React.ChangeEvent<HTMLInputElement>) {
    setConfirmAppIdValue(e.target.value);
    confirmInputStatus && setConfirmInputStatus(undefined);
  }

  return (
    <Collapse
      bordered={false}
      css={css`
        .ant-collapse-header-text {
          font-weight: 600;
        }
      `}
    >
      <Collapse.Panel header={t('appSetting.dangerZone')} key='dangerZone'>
        <SpaceBetweenWrapper>
          <div>
            <Typography.Text strong style={{ display: 'block' }}>
              {t('appSetting.deleteThisApp')}
            </Typography.Text>
            <Typography.Text type='secondary'>{t('appSetting.deleteTip')}</Typography.Text>
          </div>

          <Button danger onClick={() => setConfirmDeleteOpen(true)}>
            {t('appSetting.deleteApp')}
          </Button>

          <Modal
            destroyOnClose
            open={confirmDeleteOpen}
            title={`${t('appSetting.confirmDelete')} ${props.appId}`}
            onCancel={handleCancelDelete}
            onOk={handleConfirmDelete}
          >
            <Typography.Text type='secondary'>{t('appSetting.deleteConfirmTip')}</Typography.Text>
            <Input
              value={confirmAppIdValue}
              placeholder={props.appId}
              status={confirmInputStatus}
              onChange={handleConfirmChange}
            />
          </Modal>
        </SpaceBetweenWrapper>
      </Collapse.Panel>
    </Collapse>
  );
};

export default SettingOther;
