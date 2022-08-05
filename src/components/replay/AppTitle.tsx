import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { Button, Form, Input, message, Modal, notification } from 'antd';
import React, { FC, useState } from 'react';

import ReplayService from '../../services/Replay.service';
import { Label } from '../styledComponents';

type AppTitleData = {
  id: string;
  name: string;
  count: number;
};
type AppTitleProps = {
  data: AppTitleData;
};
const AppTitleWrapper = styled.div`
  height: 22px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .app-name {
    margin: 0 auto 0 0;
  }
  & > *:not(.app-name) {
    margin-left: 16px;
  }
`;

const AppTitle: FC<AppTitleProps> = ({ data }) => {
  const [form] = Form.useForm<{ targetEnv: string }>();
  const [modalVisible, setModalVisible] = useState(false);

  const { run: createPlan } = useRequest(ReplayService.createPlan, {
    manual: true,
    onSuccess(res) {
      if (res.result === 1) {
        notification.success({
          message: 'Started Successfully',
        });
        form.resetFields();
        setModalVisible(false);
      } else {
        console.log(res);
        notification.error({
          message: 'Start Failed',
          description: res.desc,
        });
      }
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
    <AppTitleWrapper>
      <h1 className='app-name'>{`${data.id}_${data.name}`}</h1>
      <span>
        <Label htmlFor='case-count'>Case Count</Label>
        <span id='case-count'>{data.count}</span>
      </span>
      <Button size='small' type='primary' onClick={() => setModalVisible(true)}>
        Start replay
      </Button>
      <Modal
        title={`Start replay - ${data.id}`}
        visible={modalVisible}
        onOk={handleStartReplay}
        onCancel={() => setModalVisible(false)}
        bodyStyle={{ paddingBottom: '12px' }}
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
    </AppTitleWrapper>
  );
};

export default AppTitle;
