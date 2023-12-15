import { useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Button, Form, FormProps, Input } from 'antd';
import React from 'react';

import { DesensitizationService } from '@/services';

type DesensitizationFormType = { id: string; jarUrl: string };
const DataDesensitization = () => {
  const { message } = App.useApp();
  const { t } = useTranslation();
  const [form] = Form.useForm<DesensitizationFormType>();

  useRequest(DesensitizationService.listDesensitization, {
    onSuccess(res) {
      if (res) {
        form.setFieldsValue({
          id: res.id,
          jarUrl: res.jarUrl,
        });
      }
    },
  });

  const { run: saveDesensitization } = useRequest(DesensitizationService.saveDesensitization, {
    manual: true,
    onSuccess(success) {
      success
        ? message.success(t('message.updateSuccess'))
        : message.error(t('message.updateFailed'));
    },
  });

  const { run: deleteDesensitization } = useRequest(DesensitizationService.deleteDesensitization, {
    manual: true,
    onSuccess(success) {
      success ? message.success(t('message.delSuccess')) : message.error('message.delFailed');
    },
  });

  const handleUploadJar: FormProps<DesensitizationFormType>['onFinish'] = (value) => {
    if (value.id && !value.jarUrl) {
      deleteDesensitization({ id: value.id });
    }

    if (value.jarUrl) {
      saveDesensitization({
        jarUrl: value.jarUrl,
      });
    }
  };

  return (
    <div>
      <Form<DesensitizationFormType>
        name='data-desensitization-form'
        form={form}
        layout='inline'
        onFinish={handleUploadJar}
      >
        <Form.Item hidden name='id'>
          <Input />
        </Form.Item>

        <Form.Item
          label={t('systemSetting.dataDesensitization', { ns: 'components' })}
          name='jarUrl'
        >
          <Input
            allowClear
            placeholder={t('systemSetting.jarFileUrlPlaceholder', { ns: 'components' }) as string}
            style={{ width: '400px' }}
          />
        </Form.Item>

        {/* form submit button */}
        <Form.Item wrapperCol={{ span: 14, offset: 4 }}>
          <Button type='primary' htmlType='submit'>
            {t('save')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DataDesensitization;
