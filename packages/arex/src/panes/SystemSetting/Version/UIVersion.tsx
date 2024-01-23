import { CloudDownloadOutlined } from '@ant-design/icons';
import { useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Button, Input, Space } from 'antd';
import axios from 'axios';
import React, { FC, useMemo } from 'react';

import { isClient, isMac, MessageType } from '@/constant';
import { useMessageQueue } from '@/store';
import { versionStringCompare } from '@/utils';

const UIVersion: FC<{ value?: string }> = () => {
  const { message } = App.useApp();
  const { t } = useTranslation(['components']);
  const { messageQueue } = useMessageQueue();
  const versionDetected = useMemo(
    () => messageQueue.find((message) => message.type === MessageType.update),
    [messageQueue],
  );

  const { run: getLatestRelease } = useRequest(
    () => axios.get('https://api.github.com/repos/arextest/releases/releases/latest'),
    {
      manual: true,
      onSuccess(res) {
        const version = res.data.name;
        if (versionStringCompare(__APP_VERSION__, version) === -1) {
          const suffix = isMac ? '.dmg' : '.exe';
          const downloadUrl = res.data.assets.find((asset: { name: string }) =>
            asset.name.endsWith(suffix),
          )?.browser_download_url;
          if (downloadUrl) {
            message.info(t('systemSetting.startDownload'));
            window.open(downloadUrl);
          } else {
            message.info(t('systemSetting.checkFailed'));
          }
        } else {
          message.success(t('systemSetting.isLatest'));
        }
      },
    },
  );

  return (
    <Space size='middle'>
      <Input readOnly value={__APP_VERSION__} variant='borderless' />

      {isClient && (
        <Button
          size='small'
          type='primary'
          icon={<CloudDownloadOutlined />}
          onClick={getLatestRelease}
        >
          {t('systemSetting.checkUpdate')}
        </Button>
      )}

      {isClient && versionDetected && <span>{t('systemSetting.newVersionDetected')}</span>}
    </Space>
  );
};

export default UIVersion;
