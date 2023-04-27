import { PlayCircleOutlined, SyncOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { App, Button, DatePicker, Form, Input, Modal, Select, Typography } from 'antd';
import { getLocalStorage, PanesTitle, TooltipButton, useTranslation } from 'arex-core';
import dayjs, { Dayjs } from 'dayjs';
import React, { FC, ReactNode, useMemo, useState } from 'react';

import { EMAIL_KEY } from '../../constant';
import { ApplicationService, ScheduleService } from '../../services';
import { ApplicationDataType } from '../../services/ApplicationService';

type AppTitleProps = {
  data: ApplicationDataType;
  onRefresh?: () => void;
};

type CreatePlanForm = {
  targetEnv: string;
  caseSourceFrom: Dayjs;
  caseSourceTo: Dayjs;
  operationList?: string[];
};

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

const InitialValues = {
  targetEnv: '',
  caseSourceFrom: dayjs().subtract(1, 'day').startOf('day'), // 前一天零点
  caseSourceTo: dayjs().add(1, 'day').startOf('day').subtract(1, 'second'), // 当天最后一秒
};

const AppTitle: FC<AppTitleProps> = ({ data, onRefresh }) => {
  const { t } = useTranslation(['components']);
  const { notification } = App.useApp();
  const email = getLocalStorage<string>(EMAIL_KEY);

  const [form] = Form.useForm<CreatePlanForm>();
  const targetEnv = Form.useWatch('targetEnv', form);

  const [open, setOpen] = useState(false);
  const [interfacesOptions, setInterfacesOptions] = useState<any[]>([]);

  const webhook = useMemo(
    () => `${location.origin}/api/createPlan?appId=${data.appId}&targetEnv=${targetEnv}`,
    [data.appId, targetEnv],
  );

  /**
   * 请求 InterfacesList
   */
  useRequest(() => ApplicationService.queryInterfacesList<'Global'>({ id: data.appId }), {
    ready: open,
    onSuccess(res) {
      setInterfacesOptions(res.map((item) => ({ label: item.operationName, value: item.id })));
    },
  });

  /**
   * 创建回放
   */
  const { run: createPlan, loading: confirmLoading } = useRequest(ScheduleService.createPlan, {
    manual: true,
    onSuccess(res) {
      if (res.result === 1) {
        notification.success({
          message: t('replay.startSuccess'),
        });
        onRefresh?.();
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
          operationCaseInfoList: values.operationList?.map((operationId) => ({
            operationId,
          })),
          operator: email as string,
          replayPlanType: Number(Boolean(values.operationList?.length)),
        });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleOpenSetting = () => {
    // TODO: 跳转页面
    // customNavigate(
    //   `/${params.workspaceId}/${PagesType.AppSetting}/${data.id}?data=${encodeURIComponent(
    //     JSON.stringify(data),
    //   )}`,
    // );
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
          initialValues={InitialValues}
          autoComplete='off'
        >
          <Form.Item
            label={t('replay.targetHost')}
            name='targetEnv'
            rules={[{ required: true, message: t('replay.emptyHost') as string }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={t('replay.caseStartTime')}
            name='caseSourceFrom'
            rules={[{ required: true, message: t('replay.emptyStartTime') as string }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label={t('replay.caseEndTime')}
            name='caseSourceTo'
            rules={[{ required: true, message: t('replay.emptyEndTime') as string }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label={t('replay.operation')} name='operationList'>
            <Select
              mode='multiple'
              maxTagCount={3}
              options={interfacesOptions}
              placeholder={'optional'}
              optionFilterProp='label'
            />
          </Form.Item>

          <Form.Item label={'webhook'}>
            <Typography.Text copyable>{webhook}</Typography.Text>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AppTitle;
