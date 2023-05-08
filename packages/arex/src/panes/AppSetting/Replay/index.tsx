import { useRequest } from 'ahooks';
import { App, Button, Form, InputNumber } from 'antd';
import { useTranslation } from 'arex-core';
import React from 'react';
import { useImmer } from 'use-immer';

import { KeyValueType } from '@/panes/Environment/EditableKeyValueTable';
import { ConfigService } from '@/services';

import { SettingRecordProps } from '../Record';
import SettingForm from '../SettingForm';
import { ExcludeOperation } from './FormItem';

type SettingFormType = {
  offsetDays: number;
  excludeOperationMap: KeyValueType[];
};

const defaultValues: SettingFormType = {
  offsetDays: 0,
  excludeOperationMap: [],
};

const SettingReplay: React.FC<SettingRecordProps> = ({ appId }) => {
  const { message } = App.useApp();
  const { t } = useTranslation(['components', 'common']);

  const [initialValues, setInitialValues] = useImmer<SettingFormType>(defaultValues);

  const { loading } = useRequest(ConfigService.queryReplaySetting, {
    defaultParams: [{ id: appId }],
    onSuccess(res) {
      setInitialValues({
        offsetDays: res.offsetDays,
        // @ts-ignore
        excludeOperationMap: Object.entries(res.excludeOperationMap).map(([key, value]) => ({
          key,
          value,
        })),
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
    };
    updateReplaySetting(params);
  };

  return (
    <SettingForm loading={loading} initialValues={initialValues} onFinish={onFinish}>
      <Form.Item
        label={t('appSetting.caseRange')}
        name='offsetDays'
        rules={[{ required: true, message: t('appSetting.emptyCaseRange') as string }]}
      >
        <InputNumber min={1} />
      </Form.Item>

      <Form.Item label={t('appSetting.excludeOperation')} name='excludeOperationMap'>
        <ExcludeOperation appId={appId} />
      </Form.Item>

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
