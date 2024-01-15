import { useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { Divider, Form, Input } from 'antd';
import React, { FC } from 'react';

import { isClient } from '@/constant';
import ExtensionVersion from '@/panes/SystemSetting/Version/ExtensionVersion';
import { ReportService, ScheduleService, StorageService } from '@/services';

import UIVersion from './UIVersion';

const Version: FC = () => {
  const { t } = useTranslation(['components']);

  const [form] = Form.useForm<{
    api?: string;
    schedule?: string;
    storage?: string;
  }>();

  const serviceVersionHandler = (serviceName: string) => ({
    onSuccess(version: string) {
      version && form.setFieldValue(serviceName, version);
    },
    onError() {
      form.setFieldValue(serviceName, 'N/A');
    },
  });

  useRequest(ReportService.getReportServiceVersion, {
    ...serviceVersionHandler('api'),
  });

  useRequest(ScheduleService.getScheduleServiceVersion, {
    ...serviceVersionHandler('schedule'),
  });

  useRequest(StorageService.getStorageServiceVersion, {
    ...serviceVersionHandler('storage'),
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
          chromeExtension: window.__AREX_EXTENSION_VERSION__ ?? 'NOT INSTALLED',
        }}
      >
        <Form.Item label={'UI'} style={{ marginBottom: '-4px' }}>
          <UIVersion />
        </Form.Item>

        {!isClient && (
          <Form.Item
            label={'CHROME EXTENSION'}
            name='chromeExtension'
            style={{ marginBottom: '-4px' }}
          >
            <ExtensionVersion />
          </Form.Item>
        )}

        <Form.Item label={'API_SERVICE'} name='api' style={{ marginBottom: '-4px' }}>
          <Input readOnly bordered={false} />
        </Form.Item>

        <Form.Item label={'SCHEDULE_SERVICE'} name='schedule' style={{ marginBottom: '-4px' }}>
          <Input readOnly bordered={false} />
        </Form.Item>

        <Form.Item label={'STORAGE_SERVICE'} name='storage' style={{ marginBottom: '-4px' }}>
          <Input readOnly bordered={false} />
        </Form.Item>
      </Form>
    </>
  );
};

export default Version;
