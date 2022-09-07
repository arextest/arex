import { SettingOutlined, SyncOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { Button, Form, Input, Modal, notification } from 'antd';
import React, { FC, ReactNode, useState } from 'react';

import { MenuTypeEnum, PageTypeEnum } from '../../constant';
import ReplayService from '../../services/Replay.service';
import { useStore } from '../../store';
import { Label, PanesTitle } from '../styledComponents';
import TooltipButton from '../TooltipButton';

type AppTitleData = {
  id: string;
  name: string;
  count: number;
};
type AppTitleProps = {
  data: AppTitleData;
  onRefresh?: () => void;
};

const TitleWrapper = styled(
  (props: {
    className?: string;
    title: ReactNode;
    onRefresh?: () => void;
    onSetting?: () => void;
  }) => (
    <div className={props.className}>
      <span>{props.title}</span>
      {props.onRefresh && (
        <TooltipButton
          size='small'
          type='text'
          title='refresh'
          icon={<SyncOutlined />}
          onClick={props.onRefresh}
        />
      )}
      <TooltipButton
        size='small'
        type='text'
        title='setting'
        icon={<SettingOutlined />}
        onClick={props.onSetting}
      />
    </div>
  ),
)`
  display: flex;
  align-items: baseline;
  & > :first-of-type {
    margin-right: 4px;
  }
`;

const AppTitle: FC<AppTitleProps> = ({ data, onRefresh }) => {
  const {
    userInfo: { email },
    setPanes,
  } = useStore();
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
        onRefresh && onRefresh();
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
          operator: email as string,
          replayPlanType: 0,
        });
        console.log('Received values of form: ', values);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleOpenSetting = () => {
    setPanes(
      {
        title: `Setting ${data.id}`,
        key: `SETTING__${data.id}`,
        menuType: MenuTypeEnum.Replay,
        pageType: PageTypeEnum.ReplaySetting,
        isNew: false,
        // data: app,
      },
      'push',
    );
  };
  return (
    <>
      <PanesTitle
        title={<TitleWrapper title={data.id} onRefresh={onRefresh} onSetting={handleOpenSetting} />}
        extra={
          <Button size='small' type='primary' onClick={() => setModalVisible(true)}>
            Start replay
          </Button>
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
