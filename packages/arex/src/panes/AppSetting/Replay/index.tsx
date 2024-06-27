import { HelpTooltip, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Button, Form, Input, InputNumber } from 'antd';
import React from 'react';
import { useImmer } from 'use-immer';

import UndertoneWrapper from '@/panes/AppSetting/UndertoneWrapper';
import { ConfigService } from '@/services';
import { KeyValueType } from '@/services/FileSystemService';

import SettingForm from '../SettingForm';
import { ExcludeOperation } from './FormItem';

type SettingFormType = {
  offsetDays: number;
  excludeOperationMap: KeyValueType[];
  sendMaxQps: number;
  mockHandlerJarUrl: string;
};

const defaultValues: SettingFormType = {
  offsetDays: 0,
  excludeOperationMap: [],
  sendMaxQps: 0,
  mockHandlerJarUrl: '',
};

interface SettingReplayProps {
  appId: string;
}

const SettingReplay: React.FC<SettingReplayProps> = ({ appId }) => {
  const { message } = App.useApp();
  const { t } = useTranslation(['components', 'common']);

  const [initialValues, setInitialValues] = useImmer<SettingFormType>(defaultValues);

  const { loading } = useRequest(ConfigService.queryReplaySetting, {
    defaultParams: [{ appId }],
    onSuccess(res) {
      setInitialValues({
        offsetDays: res.offsetDays,
        // @ts-ignore
        excludeOperationMap: res.excludeOperationMap
          ? Object.entries(res.excludeOperationMap).map(([key, value]) => ({
              key,
              value,
            }))
          : [],
        sendMaxQps: res.sendMaxQps,
        mockHandlerJarUrl: res.mockHandlerJarUrl || '',
      });
    },
  });

  const { run: updateReplaySetting } = useRequest(ConfigService.updateReplaySetting, {
    manual: true,
    onSuccess(res) {
      res && message.success(t('message.updateSuccess', { ns: 'common' }));
    },
  });

  const onFinish = (values: SettingFormType) => {
    const params = {
      appId,
      offsetDays: values.offsetDays,
      excludeOperationMap: values.excludeOperationMap.reduce<{ [key: string]: string[] }>(
        (map, cur) => {
          // @ts-ignore
          map[cur.key] = cur.value;
          return map;
        },
        {},
      ),
      sendMaxQps: values.sendMaxQps,
      mockHandlerJarUrl: values.mockHandlerJarUrl,
    };
    updateReplaySetting(params);
  };

  return (
    <SettingForm loading={loading} initialValues={initialValues} onFinish={onFinish}>
      <UndertoneWrapper>
        <Form.Item
          label={
            <HelpTooltip title={t('appSetting.QPSTips')}>{t('appSetting.maxQPS')}</HelpTooltip>
          }
          name='sendMaxQps'
          rules={[{ required: true, message: t('appSetting.emptyQPS') }]}
        >
          <InputNumber min={1} max={20} precision={0} />
        </Form.Item>

        <Form.Item
          label={
            <HelpTooltip
              maxWidth='360px'
              title={
                <>
                  <div>{t('appSetting.skipMockTooltip')}</div>
                  <div style={{ marginTop: '4px' }}>DB:</div>
                  <div>
                    {`Path: <DB dbName> `}
                    <strong>demoDb</strong>
                  </div>
                  <div>
                    {`Value: <Operation type> `}
                    <strong>query,insert</strong>
                  </div>
                  <div style={{ marginTop: '4px' }}>Http client:</div>
                  <div>
                    {`Path: <Class fullName> `}
                    <strong>com.company.demoClass</strong>
                  </div>
                  <div>
                    {`Value: <Method Name> `}
                    <strong>DemoMethod</strong>
                  </div>
                </>
              }
            >
              {t('appSetting.skipMock')}
            </HelpTooltip>
          }
          name='excludeOperationMap'
        >
          <ExcludeOperation appId={appId} />
        </Form.Item>

        <Form.Item name='mockHandlerJarUrl' label={t('appSetting.mockHandlerJarUrl')}>
          <Input placeholder={t('appSetting.mockHandlerJarUrlTip')} />
        </Form.Item>
      </UndertoneWrapper>

      <Form.Item
        wrapperCol={{ offset: 8, span: 16 }}
        style={{ textAlign: 'right', marginTop: '16px' }}
      >
        <Button type='primary' htmlType='submit'>
          {t('save', { ns: 'common' })}
        </Button>
      </Form.Item>
    </SettingForm>
  );
};

export default SettingReplay;
