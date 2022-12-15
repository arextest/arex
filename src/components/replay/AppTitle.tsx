import { PlayCircleOutlined, SettingOutlined, SyncOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { Button, DatePicker, Form, Input, Modal, notification } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { FC, ReactNode, useState } from 'react';

import { EmailKey } from '../../constant';
import { generateGlobalPaneId, getLocalStorage } from '../../helpers/utils';
import { MenusType } from '../../menus';
import { PagesType } from '../../pages';
import ReplayService from '../../services/Replay.service';
import { ApplicationDataType } from '../../services/Replay.type';
import { useStore } from '../../store';
import { PanesTitle } from '../styledComponents';
import TooltipButton from '../TooltipButton';

type AppTitleProps = {
  data: ApplicationDataType;
  onRefresh?: () => void;
};

type CreatePlanForm = { targetEnv: string; caseStartTime: Dayjs; caseEndTime: Dayjs };

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
      {/*<TooltipButton*/}
      {/*  size='small'*/}
      {/*  type='text'*/}
      {/*  title='setting'*/}
      {/*  icon={<SettingOutlined />}*/}
      {/*  onClick={props.onSetting}*/}
      {/*/>*/}
    </div>
  ),
)`
  display: flex;
  align-items: center;
  & > :first-of-type {
    margin-right: 4px;
  }
`;

const AppTitle: FC<AppTitleProps> = ({ data, onRefresh }) => {
  const email = getLocalStorage<string>(EmailKey);
  const { setPages } = useStore();

  const [form] = Form.useForm<CreatePlanForm>();
  const [open, setOpen] = useState(false);

  const initialValues = {
    targetEnv: '',
    caseStartTime: dayjs().subtract(1, 'day').startOf('day'), // 前一天零点
    caseEndTime: dayjs().add(1, 'day').startOf('day').subtract(1, 'second'), // 当天最后一秒
  };

  const { run: createPlan, loading: confirmLoading } = useRequest(ReplayService.createPlan, {
    manual: true,
    onSuccess(res) {
      if (res.result === 1) {
        notification.success({
          message: 'Started Successfully',
        });
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
      setOpen(false);
      form.resetFields();
    },
  });

  const handleStartReplay = () => {
    form
      .validateFields()
      .then((values) => {
        createPlan({
          appId: data.appId,
          sourceEnv: 'pro',
          targetEnv: values.targetEnv,
          caseStartTime: values.caseStartTime.startOf('day').valueOf(),
          caseEndTime: values.caseEndTime
            .add(1, 'day')
            .startOf('day')
            .subtract(1, 'second')
            .valueOf(),
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
    setPages(
      {
        title: `Setting ${data.appId}`,
        menuType: MenusType.AppSetting,
        pageType: PagesType.AppSetting,
        isNew: false,
        data,
        paneId: generateGlobalPaneId(MenusType.AppSetting, PagesType.AppSetting, data.id),
        rawId: data.id,
      },
      'push',
    );
  };
  return (
    <div>
      <PanesTitle
        title={
          <TitleWrapper title={data.appId} onRefresh={onRefresh} onSetting={handleOpenSetting} />
        }
        extra={
          <Button
            size='small'
            type='primary'
            icon={<PlayCircleOutlined />}
            onClick={() => setOpen(true)}
          >
            Start replay
          </Button>
        }
      />

      <Modal
        title={`Start replay - ${data.appId}`}
        open={open}
        onOk={handleStartReplay}
        onCancel={() => setOpen(false)}
        bodyStyle={{ paddingBottom: '12px' }}
        confirmLoading={confirmLoading}
      >
        <Form
          name='startReplay'
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={initialValues}
          autoComplete='off'
        >
          <Form.Item
            label='Target Host'
            name='targetEnv'
            rules={[{ required: true, message: "Target Host can't be empty" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Start Time'
            name='caseStartTime'
            rules={[{ required: true, message: "Start Time can't be empty" }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label='End Time'
            name='caseEndTime'
            rules={[{ required: true, message: "End Time can't be empty" }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AppTitle;
