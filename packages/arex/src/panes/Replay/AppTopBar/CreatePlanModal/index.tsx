import {
  css,
  getLocalStorage,
  HelpTooltip,
  i18n,
  I18nextLng,
  Label,
  useTranslation,
} from '@arextest/arex-core';
import { useLocalStorageState, useRequest } from 'ahooks';
import {
  App,
  Button,
  Collapse,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Typography,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react';

import { InterfaceSelect, TagSelect } from '@/components';
import { EMAIL_KEY, isClient, TARGET_HOST_AUTOCOMPLETE_KEY } from '@/constant';
import Record from '@/panes/AppSetting/Record';
import TargetUrlInput, {
  TargetUrlValue,
} from '@/panes/Replay/AppTopBar/CreatePlanModal/TargetUrlInput';
import { ScheduleService } from '@/services';
import { CaseTags, MessageMap } from '@/services/ScheduleService';

type CreatePlanForm = {
  planName?: string;
  targetUrl?: TargetUrlValue;
  caseSourceRange: [Dayjs, Dayjs];
  operationList?: string[];
  caseCountLimit?: number;
  caseTags?: CaseTags;
};

export type CreatePlanModalRef = {
  open: () => void;
};

export type CreatePlanModalProps = {
  appId: string;
  tags?: Record<string, string[]>;
  onCreated?: () => void;
};

const DefaultProtocol = 'http';
const ProtocolOptions = [
  { label: 'http://', value: 'http://' },
  { label: 'https://', value: 'https://' },
  { label: 'dubbo://', value: 'dubbo://' },
];

const CreatePlanModal = forwardRef<CreatePlanModalRef, CreatePlanModalProps>(
  ({ appId, tags, onCreated }, ref) => {
    const { notification } = App.useApp();
    const email = getLocalStorage<string>(EMAIL_KEY);

    const { t } = useTranslation(['components']);

    const [open, setOpen] = useState(false);
    useImperativeHandle(
      ref,
      () => ({
        open: () => setOpen(true),
      }),
      [],
    );

    const [form] = Form.useForm<CreatePlanForm>();

    const targetUrl = Form.useWatch('targetUrl', form);
    const planName = Form.useWatch('planName', form);
    const caseSourceRange = Form.useWatch('caseSourceRange', form);
    const operationList = Form.useWatch('operationList', form);
    const caseCountLimit = Form.useWatch('caseCountLimit', form);

    const [targetUrlSource, setTargetUrlSource] = useLocalStorageState<Record<string, string>>(
      TARGET_HOST_AUTOCOMPLETE_KEY,
      {
        defaultValue: {},
      },
    );

    const InitialValues = {
      targetUrl: {
        protocol: (targetUrlSource?.[appId]?.split?.('://')[0] || DefaultProtocol) + '://',
        host: targetUrlSource?.[appId]?.split?.('://')[1],
      },
      caseSourceRange: [
        dayjs().subtract(1, 'day').startOf('day'), // 前一天零点
        dayjs().add(1, 'day').startOf('day').subtract(1, 'second'), // 当天最后一秒
      ],
    };

    const webhook = useMemo(() => {
      const url = new URL(`${location.origin}/schedule/createPlan`);

      url.searchParams.append('appId', appId);
      targetUrl &&
        url.searchParams.append('targetEnv', targetUrl.protocol + (targetUrl.host?.trim() || ''));
      planName && url.searchParams.append('planName', planName.trim());
      if (caseSourceRange && caseSourceRange?.length === 2) {
        url.searchParams.append('caseSourceFrom', caseSourceRange[0].valueOf().toString());
        url.searchParams.append('caseSourceTo', caseSourceRange[1].valueOf().toString());
      }
      operationList?.length && url.searchParams.append('operationIds', operationList.join(','));
      typeof caseCountLimit === 'number' &&
        url.searchParams.append('caseCountLimit', caseCountLimit.toString());
      return url.toString();
    }, [appId, planName, caseSourceRange, operationList, caseCountLimit]);

    /**
     * 创建回放
     */
    const { run: createPlan, loading: confirmLoading } = useRequest(
      isClient ? ScheduleService.createPlanLocal : ScheduleService.createPlan,
      {
        manual: true,
        onSuccess(res) {
          if (res.result === 1) {
            notification.success({
              message: t('replay.startSuccess'),
            });
            onCreated?.();
          } else {
            console.error(res.desc);
            notification.error({
              message: t('replay.startFailed'),
              description: MessageMap[i18n.language as I18nextLng][res.data.reasonCode],
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
      },
    );

    const handleStartReplay = () => {
      form
        .validateFields()
        .then((values) => {
          const targetEnv = values.targetUrl!.protocol! + values.targetUrl!.host!.trim();
          createPlan({
            appId,
            sourceEnv: 'pro',
            targetEnv,
            planName: values.planName,
            caseSourceFrom: values.caseSourceRange[0].valueOf(),
            caseSourceTo: values.caseSourceRange[1].valueOf(),
            operationCaseInfoList: values.operationList?.map((operationId) => ({
              operationId,
            })),
            operator: email as string,
            replayPlanType: Number(Boolean(values.operationList?.length)),
            caseCountLimit: values.caseCountLimit,
            caseTags: values.caseTags,
          });

          // update targetHostSource
          setTargetUrlSource((source) => {
            !source && (source = {});
            source[appId] = targetEnv;
            return source;
          });
        })
        .catch((info) => {
          console.error('Validate Failed:', info);
        });
    };

    const handleCloseModal = useCallback(() => {
      setOpen(false);
      form.resetFields();
    }, [form]);

    return (
      <Modal
        title={`${t('replay.startButton')} - ${appId}`}
        open={open}
        onOk={handleStartReplay}
        onCancel={handleCloseModal}
        styles={{
          body: { padding: '8px 0' },
        }}
        confirmLoading={confirmLoading}
      >
        <Form
          name={`startReplay-${appId}`}
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
            name='targetUrl'
            rules={[
              {
                validator: (rule, value) => {
                  try {
                    if (!value?.protocol?.match(/^([a-zA-Z]+):\/\/$/))
                      return Promise.reject(t('replay.illegalProtocol'));
                    else if (!value?.host?.trim()) return Promise.reject(t('replay.emptyHost'));
                    else return Promise.resolve();
                  } catch (error) {
                    return Promise.reject(error);
                  }
                },
              },
            ]}
          >
            <TargetUrlInput options={ProtocolOptions} />
          </Form.Item>

          <Form.Item
            label={
              <HelpTooltip title={t('replay.caseRangeTooltip')}>
                {t('replay.caseRange')}
              </HelpTooltip>
            }
            name='caseSourceRange'
            rules={[{ required: true, message: t('replay.emptyCaseRange') as string }]}
            css={css`
              .ant-picker-dropdown .ant-picker-footer-extra {
                position: absolute;
                border: none;
                bottom: 3px;
              }
            `}
          >
            <DatePicker.RangePicker
              format='YYYY-MM-DD HH:mm'
              showTime={{ format: 'HH:mm' }}
              getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
              renderExtraFooter={() => (
                <>
                  <Label type='secondary'>{t('dateRangePreset.quickPick', { ns: 'common' })}</Label>
                  <Button
                    size={'small'}
                    onClick={() => {
                      form.setFieldsValue({
                        caseSourceRange: [dayjs().subtract(1, 'day'), dayjs()],
                      });
                    }}
                  >
                    {t('dateRangePreset.1d', { ns: 'common' })}
                  </Button>
                </>
              )}
              placeholder={[t('replay.caseStartTime'), t('replay.caseEndTime')]}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Collapse
            css={css`
              margin-top: -8px;
              background-color: transparent;
              .ant-collapse-content-box {
                padding: 0 !important;
              }
            `}
            bordered={false}
            items={[
              {
                key: 'advancedOptions',
                label: (
                  <Typography.Text>
                    {t('advancedOptions', {
                      ns: 'common',
                    })}
                  </Typography.Text>
                ),
                children: (
                  <>
                    <Form.Item label={t('replay.planName')} name='planName'>
                      <Input allowClear placeholder={t('replay.planNamePlaceholder') as string} />
                    </Form.Item>
                    <Form.Item
                      label={
                        <HelpTooltip title={t('replay.pathsTooltip')}>
                          {t('replay.paths')}
                        </HelpTooltip>
                      }
                      name='operationList'
                    >
                      <InterfaceSelect
                        appId={appId}
                        open={open}
                        placeholder={t('replay.pathsPlaceholder')}
                      />
                    </Form.Item>

                    <Form.Item label={t('replay.caseCountLimit')} name='caseCountLimit'>
                      <InputNumber
                        precision={0}
                        min={0}
                        addonAfter={t('replay.caseCountUnit')}
                        placeholder={t('replay.caseCountLimitPlaceholder') as string}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>

                    <Form.Item label={t('replay.caseTags')} name='caseTags'>
                      <TagSelect multiple tags={tags} />
                    </Form.Item>

                    <Form.Item label={'Webhook'}>
                      <Typography.Text copyable ellipsis>
                        {webhook}
                      </Typography.Text>
                    </Form.Item>
                  </>
                ),
              },
            ]}
          />
        </Form>
      </Modal>
    );
  },
);

export default CreatePlanModal;
