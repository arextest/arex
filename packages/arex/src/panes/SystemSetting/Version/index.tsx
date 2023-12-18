import { CloudDownloadOutlined } from '@ant-design/icons';
import { useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Button, Divider, Form, Input, Space } from 'antd';
import axios from 'axios';
import React, { FC, useMemo } from 'react';

import { isClient, isMac } from '@/constant';
import { ReportService, ScheduleService, StorageService } from '@/services';
import { useMessageQueue } from '@/store';
import { versionStringCompare } from '@/utils';

const AppVersion: FC<{ value?: string }> = () => {
  const { message } = App.useApp();
  const { t } = useTranslation(['components']);
  const { messageQueue } = useMessageQueue();
  const versionDetected = useMemo(
    () => messageQueue.find((message) => message.type === 'update'),
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
    <>
      <Input readOnly value={__APP_VERSION__} bordered={false} style={{ width: '48px' }} />

      {isClient && (
        <Space size='middle'>
          <Button
            size='small'
            type='primary'
            icon={<CloudDownloadOutlined />}
            onClick={getLatestRelease}
          >
            {t('systemSetting.checkUpdate')}
          </Button>
          {versionDetected && <span>{t('systemSetting.newVersionDetected')}</span>}
        </Space>
      )}
    </>
  );
};

const Version: FC = () => {
  const { t } = useTranslation(['components']);

  const [form] = Form.useForm<{
    report?: string;
    schedule?: string;
    storage?: string;
  }>();

  useRequest(ReportService.getReportServiceVersion, {
    onSuccess(version) {
      version && form.setFieldValue('report', version);
    },
  });

  useRequest(ScheduleService.getScheduleServiceVersion, {
    onSuccess(version) {
      version && form.setFieldValue('schedule', version);
    },
  });

  useRequest(StorageService.getStorageServiceVersion, {
    onSuccess(version) {
      version && form.setFieldValue('storage', version);
    },
  });

  return (
    <>
      <Divider orientation='left'> {t('systemSetting.version')}</Divider>

      <Form
        name='system-setting-application-form'
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        initialValues={{
          version: __APP_VERSION__,
        }}
      >
        <Form.Item label={'UI'} style={{ marginBottom: '-4px' }}>
          <AppVersion />
        </Form.Item>
        <Form.Item label={'REPORT'} name='report' style={{ marginBottom: '-4px' }}>
          <Input readOnly bordered={false} />
        </Form.Item>
        <Form.Item label={'SCHEDULE'} name='schedule' style={{ marginBottom: '-4px' }}>
          <Input readOnly bordered={false} />
        </Form.Item>
        <Form.Item label={'STORAGE'} name='storage' style={{ marginBottom: '-4px' }}>
          <Input readOnly bordered={false} />
        </Form.Item>
      </Form>
    </>
  );
};

export default Version;
