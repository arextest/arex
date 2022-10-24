import { SettingOutlined, SyncOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { Button, Form, Input, Modal, notification } from 'antd';
import React, { FC, ReactNode, useState } from 'react';

import { generateGlobalPaneId } from '../../helpers/utils';
import { MenuTypeEnum } from '../../menus';
import { PageTypeEnum } from '../../pages';
import ReplayService from '../../services/Replay.service';
import { ApplicationDataType } from '../../services/Replay.type';
import { useStore } from '../../store';
import { PanesTitle } from '../styledComponents';
import TooltipButton from '../TooltipButton';

type AppTitleProps = {
  data: ApplicationDataType;
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
    setPages,
  } = useStore();
  const [form] = Form.useForm<{ targetEnv: string }>();
  const [open, setOpen] = useState(false);

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
      setOpen(false);
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
        menuType: MenuTypeEnum.Replay,
        pageType: PageTypeEnum.ReplaySetting,
        isNew: false,
        data,
        paneId: generateGlobalPaneId(MenuTypeEnum.Replay, PageTypeEnum.ReplaySetting, data.id),
        rawId: data.id,
      },
      'push',
    );
  };
  return (
    <>
      <PanesTitle
        title={
          <TitleWrapper title={data.appId} onRefresh={onRefresh} onSetting={handleOpenSetting} />
        }
        extra={
          <Button size='small' type='primary' onClick={() => setOpen(true)}>
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
