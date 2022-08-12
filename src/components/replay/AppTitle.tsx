import { useRequest } from 'ahooks';
import { Button, Form, Input, Modal, notification } from 'antd';
import React, { FC, useState } from 'react';

import ReplayService from '../../services/Replay.service';
import { Label, PanesTitle } from '../styledComponents';

type AppTitleData = {
  id: string;
  name: string;
  count: number;
};
type AppTitleProps = {
  data: AppTitleData;
  onCreatePlan?: () => void;
};

const AppTitle: FC<AppTitleProps> = ({ data, onCreatePlan }) => {
  const [form] = Form.useForm<{ targetEnv: string }>();
  const [modalVisible, setModalVisible] = useState(false);

  const { run: createPlan, loading: confirmLoading } = useRequest(ReplayService.createPlan, {
    manual: true,
    onSuccess(res) {
      if (res.result === 1) {
        notification.success({
          message: 'Started Successfully',
        });
        form.resetFields();
        onCreatePlan && onCreatePlan();
      } else {
        console.error(res.desc);
        notification.error({
          message: 'Start Failed',
          description: res.desc,
        });
      }
    },
    onError(e) {
      notification.error({
        message: 'Start Failed',
        description: e.message,
      });
    },
    onFinally() {
      setModalVisible(false);
    },
  });
  const handleStartReplay = () => {
    form
      .validateFields()
      .then((values) => {
        createPlan({
          appId: data.id,
          sourceEnv: 'pro',
          targetEnv: values.targetEnv,
          operator: 'Visitor',
          replayPlanType: 0,
        });
        console.log('Received values of form: ', values);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };
  return (
    <>
      <PanesTitle
        title={`${data.id}_${data.name}`}
        extra={
          <>
            <span>
              <Label htmlFor='case-count'>Case Count</Label>
              <span id='case-count'>{data.count}</span>
            </span>
            <Button size='small' type='primary' onClick={() => setModalVisible(true)}>
              Start replay
            </Button>
          </>
        }
      />

      <Modal
        title={`Start replay - ${data.id}`}
        visible={modalVisible}
        onOk={handleStartReplay}
        onCancel={() => setModalVisible(false)}
        bodyStyle={{ paddingBottom: '12px' }}
        confirmLoading={confirmLoading}
      >
        <Form name='startReplay' form={form} autoComplete='off'>
          <Form.Item
            label='Target Host'
            name='targetEnv'
            rules={[{ required: true, message: "Target Host can't be empty" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AppTitle;
