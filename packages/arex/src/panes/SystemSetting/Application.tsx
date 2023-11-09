import { CloudDownloadOutlined } from '@ant-design/icons';
import { useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Button, Form, Input } from 'antd';
import axios from 'axios';
import React, { FC } from 'react';

import { isClient, isMac } from '@/constant';
import { versionStringCompare } from '@/utils';

const AppVersion: FC<{ value?: string }> = (props) => {
  const { message } = App.useApp();
  const { t } = useTranslation(['components']);

  const { run: getLatestRelease } = useRequest(
    () => axios.get('https://api.github.com/repos/1pone/arex-release/releases/latest', {}),
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
            message.info(t('systemSetting.newVersionDetected'));
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
    <>
      <Input readOnly value={props.value} bordered={false} style={{ width: '64px' }} />
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
    </>
  );
};

const Application: FC = () => {
  const { t } = useTranslation(['components']);

  return (
    <>
      <Form
        name='system-setting-application-form'
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        initialValues={{
          version: __APP_VERSION__,
        }}
      >
        <Form.Item label={t('systemSetting.version')} name='version'>
          <AppVersion />
        </Form.Item>
      </Form>
    </>
  );
};

export default Application;
