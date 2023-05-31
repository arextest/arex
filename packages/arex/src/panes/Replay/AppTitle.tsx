import { CloseCircleOutlined, PlayCircleOutlined, SyncOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useLocalStorageState, useRequest } from 'ahooks';
import {
  App,
  AutoComplete,
  Button,
  DatePicker,
  Form,
  Modal,
  Select,
  theme,
  Typography,
} from 'antd';
import {
  getLocalStorage,
  HelpTooltip,
  PanesTitle,
  SpaceBetweenWrapper,
  TooltipButton,
  useTranslation,
} from 'arex-core';
import dayjs, { Dayjs } from 'dayjs';
import React, { FC, ReactNode, useMemo, useState } from 'react';

import { EMAIL_KEY, TARGET_HOST_AUTOCOMPLETE_KEY } from '@/constant';
import { ApplicationService, ScheduleService } from '@/services';
import { ApplicationDataType } from '@/services/ApplicationService';

type AppTitleProps = {
  data: ApplicationDataType;
  onRefresh?: () => void;
};

type CreatePlanForm = {
  targetEnv: string;
  caseSourceRange: [Dayjs, Dayjs];
  operationList?: string[];
};

const TitleWrapper = styled(
  (props: { className?: string; title: ReactNode; onRefresh?: () => void }) => {
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
  caseSourceRange: [
    dayjs().subtract(1, 'day').startOf('day'), // 前一天零点
    dayjs().add(1, 'day').startOf('day').subtract(1, 'second'), // 当天最后一秒
  ],
};

const AppTitle: FC<AppTitleProps> = ({ data, onRefresh }) => {
  const { t } = useTranslation(['components']);
  const { notification } = App.useApp();
  const { token } = theme.useToken();
  const email = getLocalStorage<string>(EMAIL_KEY);

  const [form] = Form.useForm<CreatePlanForm>();
  const targetEnv = Form.useWatch('targetEnv', form);

  const [open, setOpen] = useState(false);
  const [interfacesOptions, setInterfacesOptions] = useState<any[]>([]);

  const [targetHostSource, setTargetHostSource] = useLocalStorageState<{
    [appId: string]: string[];
  }>(TARGET_HOST_AUTOCOMPLETE_KEY, {
    defaultValue: {},
  });

  const webhook = useMemo(
    () => `${location.origin}/api/createPlan?appId=${data.appId}&targetEnv=${targetEnv?.trim()}`,
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
        const targetEnv = values.targetEnv.trim();
        createPlan({
          appId: data.appId,
          sourceEnv: 'pro',
          targetEnv,
          caseSourceFrom: values.caseSourceRange[0].startOf('day').valueOf(),
          caseSourceTo: values.caseSourceRange[1]
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

        // update targetHostSource
        setTargetHostSource((source) => {
          !source && (source = {});

          if (source?.[data.appId] && !source?.[data.appId].includes(targetEnv))
            source[data.appId].push(targetEnv);
          else if (!source?.[data.appId]) source[data.appId] = [targetEnv];

          return source;
        });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const targetHostOptions = useMemo(
    () =>
      targetHostSource?.[data.appId]?.map((item) => ({
        label: (
          <SpaceBetweenWrapper>
            <Typography.Text>{item}</Typography.Text>
            <Button
              size='small'
              type='text'
              icon={
                <CloseCircleOutlined
                  style={{ fontSize: '10px', color: token.colorTextSecondary }}
                />
              }
              onClick={(e) => {
                e.stopPropagation();

                setTargetHostSource((source) => {
                  const targetHostList = source?.[data.appId] || [];
                  const index = targetHostList.indexOf(item);
                  if (index > -1) {
                    targetHostList.splice(index, 1);
                  }
                  return {
                    ...source,
                    [data.appId]: targetHostList,
                  };
                });
              }}
            />
          </SpaceBetweenWrapper>
        ),
        value: item,
      })) || [],
    [data.appId, targetHostSource, open],
  );

  return (
    <div>
      <PanesTitle
        title={<TitleWrapper title={data.appId} onRefresh={onRefresh} />}
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
            label={
              <HelpTooltip title={t('replay.targetHostTooltip')}>
                {t('replay.targetHost')}
              </HelpTooltip>
            }
            name='targetEnv'
            rules={[{ required: true, message: t('replay.emptyHost') as string }]}
          >
            <AutoComplete
              allowClear
              options={targetHostOptions}
              placeholder='https://<ip>:<port>'
            />
          </Form.Item>

          <Form.Item
            label={
              <HelpTooltip title={t('replay.caseRangeTooltip')}>
                {t('replay.caseRange')}
              </HelpTooltip>
            }
            name='caseSourceRange'
            rules={[{ required: true, message: t('replay.emptyCaseRange') as string }]}
          >
            <DatePicker.RangePicker
              placeholder={[t('replay.caseStartTime'), t('replay.caseEndTime')]}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label={<HelpTooltip title={t('replay.pathsTooltip')}>{t('replay.paths')}</HelpTooltip>}
            name='operationList'
          >
            <Select
              mode='multiple'
              maxTagCount={3}
              options={interfacesOptions}
              optionFilterProp='label'
            />
          </Form.Item>

          <Form.Item label={'Webhook'}>
            <Typography.Text copyable>{webhook}</Typography.Text>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AppTitle;
