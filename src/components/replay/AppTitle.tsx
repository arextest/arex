import { PlayCircleOutlined, SettingOutlined, SyncOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { Button, DatePicker, Form, Input, Modal, notification } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { FC, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { EmailKey } from '../../constant';
import { generateGlobalPaneId, getLocalStorage } from '../../helpers/utils';
import ReplayService from '../../services/Replay.service';
import { ApplicationDataType } from '../../services/Replay.type';
import { useStore } from '../../store';
import { MenusType } from '../menus';
import { PagesType } from '../panes';
import { PanesTitle } from '../styledComponents';
import TooltipButton from '../TooltipButton';

type AppTitleProps = {
  data: ApplicationDataType;
  onRefresh?: () => void;
};

type CreatePlanForm = { targetEnv: string; caseSourceFrom: Dayjs; caseSourceTo: Dayjs };

const TitleWrapper = styled(
  (props: {
    className?: string;
    title: ReactNode;
    onRefresh?: () => void;
    onSetting?: () => void;
  }) => {
    const { t } = useTranslation(['components']);

    return (
      <div className={props.className}>
        <span>{props.title}</span>
        {props.onRefresh && (
          <TooltipButton
            size='small'
            type='text'
            title={t('replay.refresh')}
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
    );
  },
)`
  display: flex;
  align-items: center;
  & > :first-of-type {
    margin-right: 4px;
  }
`;

const AppTitle: FC<AppTitleProps> = ({ data, onRefresh }) => {
  const { t } = useTranslation(['components']);

  const email = getLocalStorage<string>(EmailKey);
  const { setPages } = useStore();

  const [form] = Form.useForm<CreatePlanForm>();
  const [open, setOpen] = useState(false);

  const initialValues = {
    targetEnv: '',
    caseSourceFrom: dayjs().subtract(1, 'day').startOf('day'), // 前一天零点
    caseSourceTo: dayjs().add(1, 'day').startOf('day').subtract(1, 'second'), // 当天最后一秒
  };

  const { run: createPlan, loading: confirmLoading } = useRequest(ReplayService.createPlan, {
    manual: true,
    onSuccess(res) {
      if (res.result === 1) {
        notification.success({
          message: t('replay.startSuccess'),
        });
        onRefresh && onRefresh();
      } else {
        console.error(res.desc);
        notification.error({
          message: t('replay.startFailed'),
          description: res.desc,
        });
      }
    },
    onError(e) {
      notification.error({
        message: t('replay.startFailed'),
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
          targetEnv: values.targetEnv.trim(),
          caseSourceFrom: values.caseSourceFrom.startOf('day').valueOf(),
          caseSourceTo: values.caseSourceTo
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
            {t('replay.startButton')}
          </Button>
        }
      />

      <Modal
        title={`${t('replay.startButton')} - ${data.appId}`}
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
            label={t('replay.targetHost')}
            name='targetEnv'
            rules={[{ required: true, message: t('replay.emptyHost') }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={t('replay.caseStartTime')}
            name='caseSourceFrom'
            rules={[{ required: true, message: t('replay.emptyStartTime') }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label={t('replay.caseEndTime')}
            name='caseSourceTo'
            rules={[{ required: true, message: t('replay.emptyEndTime') }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AppTitle;
