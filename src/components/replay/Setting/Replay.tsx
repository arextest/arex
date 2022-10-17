import { useRequest } from 'ahooks';
import { Button, Form, InputNumber, message } from 'antd';
import React from 'react';

import ReplayService from '../../../services/Replay.service';
import { SettingRecordProps } from './Record';

type ReplaySettingForm = {
  offsetDays: number;
};

const Replay: React.FC<SettingRecordProps> = ({ appId, agentVersion }) => {
  const [form] = Form.useForm();

  useRequest(ReplayService.queryScheduleUseResultAppId, {
    defaultParams: [{ id: appId }],
    onSuccess(res) {
      form.setFieldsValue({
        offsetDays: res.offsetDays,
      });
    },
  });

  const { run: updateConfigSchedule } = useRequest(ReplayService.updateConfigSchedule, {
    manual: true,
    onSuccess(res) {
      res && message.success('update success');
    },
  });

  const onFinish = (values: ReplaySettingForm) => {
    updateConfigSchedule({
      appId,
      offsetDays: values.offsetDays,
      targetEnv: [],
      sendMaxQps: 20,
    });
  };

  return (
    <Form<ReplaySettingForm>
      form={form}
      name='basic'
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete='off'
    >
      <Form.Item label='Agent Version'>
        <span>{agentVersion}</span>
      </Form.Item>

      <Form.Item
        label='Case range'
        name='offsetDays'
        rules={[{ required: true, message: 'Please input your case range!' }]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        wrapperCol={{ offset: 8, span: 16 }}
        style={{ textAlign: 'right', marginTop: '16px' }}
      >
        <Button type='primary' htmlType='submit'>
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Replay;
