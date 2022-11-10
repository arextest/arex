import { useRequest } from 'ahooks';
import { Button, Form, InputNumber, message } from 'antd';
import React from 'react';
import { useImmer } from 'use-immer';

import { KeyValueType } from '../../../../pages/HttpRequestPage';
import AppSettingService from '../../../../services/AppSetting.service';
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

const SettingReplay: React.FC<SettingRecordProps> = ({ appId, agentVersion }) => {
  const [initialValues, setInitialValues] = useImmer<SettingFormType>(defaultValues);

  const { loading } = useRequest(AppSettingService.queryReplaySetting, {
    defaultParams: [{ id: appId }],
    onSuccess(res) {
      setInitialValues({
        offsetDays: res.offsetDays,
        excludeOperationMap: Object.entries(res.excludeOperationMap).map(([key, value]) => ({
          key,
          value,
        })),
      });
    },
  });

  const { run: updateReplaySetting } = useRequest(AppSettingService.updateReplaySetting, {
    manual: true,
    onSuccess(res) {
      res && message.success('update success');
    },
  });

  const onFinish = (values: SettingFormType) => {
    const params = {
      appId,
      offsetDays: values.offsetDays,
      excludeOperationMap: values.excludeOperationMap.reduce<{ [key: string]: string[] }>(
        (map, cur) => {
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
      <Form.Item label='Agent Version'>
        <span>{agentVersion}</span>
      </Form.Item>

      <Form.Item
        label='Case range'
        name='offsetDays'
        rules={[{ required: true, message: 'Please input your case range!' }]}
      >
        <InputNumber min={1} />
      </Form.Item>

      <Form.Item label='Exclude Operation' name='excludeOperationMap'>
        <ExcludeOperation appId={appId} />
      </Form.Item>

      <Form.Item
        wrapperCol={{ offset: 8, span: 16 }}
        style={{ textAlign: 'right', marginTop: '16px' }}
      >
        <Button type='primary' htmlType='submit'>
          Save
        </Button>
      </Form.Item>
    </SettingForm>
  );
};

export default SettingReplay;
