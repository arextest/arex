import { CaretUpOutlined } from '@ant-design/icons';
import { css, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Button, Collapse, Divider, Form, FormProps, Input } from 'antd';
import React, { FC, useState } from 'react';

import { SystemService } from '@/services';

import SystemLogs from './SystemLogs';

type SystemConfigForm = {
  callbackUrl: string;
  jarUrl: string;
  comparePluginUrl?: string;
};

const Advanced: FC = () => {
  const { message } = App.useApp();

  const { t } = useTranslation();
  const [expand, setExpand] = useState(false);

  const [form] = Form.useForm<SystemConfigForm>();

  useRequest(SystemService.getSystemConfig, {
    onSuccess(res) {
      if (res) {
        form.setFieldsValue({
          callbackUrl: res.callbackUrl,
          jarUrl: res.desensitizationJar?.jarUrl,
          comparePluginUrl: res.comparePluginInfo?.comparePluginUrl || '',
        });
      }
    },
  });

  useRequest(() => SystemService.querySystemConfig('auth_switch'));

  const { run: saveSystemConfig } = useRequest(SystemService.saveSystemConfig, {
    manual: true,
    onSuccess(success) {
      success
        ? message.success(t('message.updateSuccess'))
        : message.error(t('message.updateFailed'));
    },
  });

  const handleUploadJar: FormProps<SystemConfigForm>['onFinish'] = (value) => {
    saveSystemConfig({
      systemConfig: {
        callbackUrl: value.callbackUrl,
        desensitizationJar: {
          jarUrl: value.jarUrl,
        },
        comparePluginInfo: {
          comparePluginUrl: value.comparePluginUrl || '',
        },
      },
    });
  };

  return (
    <Collapse
      ghost
      activeKey={expand ? ['advanced'] : []}
      items={[
        {
          key: 'advanced',
          showArrow: false,
          label: (
            <Divider orientation='left'>
              {t('advanced')} <CaretUpOutlined rotate={expand ? 180 : 0} />
            </Divider>
          ),
          children: (
            <>
              <Form<SystemConfigForm>
                name='system-setting-form'
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                onFinish={handleUploadJar}
              >
                <Form.Item hidden name='operator'>
                  <Input />
                </Form.Item>

                <Form.Item
                  label={t('systemSetting.replayCallback', { ns: 'components' })}
                  name='callbackUrl'
                >
                  <Input
                    allowClear
                    placeholder={
                      t('systemSetting.replayCallbackPlaceholder', { ns: 'components' }) as string
                    }
                    style={{ width: '400px' }}
                  />
                </Form.Item>

                <Form.Item
                  label={t('systemSetting.dataDesensitization', { ns: 'components' })}
                  name='jarUrl'
                >
                  <Input
                    allowClear
                    placeholder={
                      t('systemSetting.jarFileUrlPlaceholder', { ns: 'components' }) as string
                    }
                    style={{ width: '400px' }}
                  />
                </Form.Item>

                <Form.Item
                  label={t('systemSetting.comparePlugin', { ns: 'components' })}
                  name='comparePluginUrl'
                >
                  <Input
                    allowClear
                    placeholder={
                      t('systemSetting.comparePluginPlaceholder', { ns: 'components' }) as string
                    }
                    style={{ width: '400px' }}
                  />
                </Form.Item>

                {/* form submit button */}
                <Form.Item wrapperCol={{ span: 20, offset: 4 }}>
                  <Button type='primary' htmlType='submit'>
                    {t('save')}
                  </Button>
                </Form.Item>
              </Form>
              <SystemLogs />
            </>
          ),
        },
      ]}
      onChange={() => {
        setExpand(!expand);
      }}
      css={css`
        .ant-collapse-header {
          padding: 0 !important;
        }
      `}
    />
  );
};

export default Advanced;
