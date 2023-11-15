import {
  CloseCircleOutlined,
  CodeOutlined,
  PlayCircleOutlined,
  SettingOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import {
  css,
  getLocalStorage,
  HelpTooltip,
  i18n,
  I18nextLng,
  Label,
  PanesTitle,
  SpaceBetweenWrapper,
  styled,
  TooltipButton,
  useArexPaneProps,
  useTranslation,
} from '@arextest/arex-core';
import { useLocalStorageState, useRequest } from 'ahooks';
import {
  App,
  AutoComplete,
  Badge,
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Popover,
  Select,
  Skeleton,
  theme,
  Typography,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, {
  createElement,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { EMAIL_KEY, PanesType, TARGET_HOST_AUTOCOMPLETE_KEY } from '@/constant';
import { useNavPane } from '@/hooks';
import CompareNoise from '@/panes/Replay/CompareNoise';
import RecordedCaseList, { RecordedCaseListRef } from '@/panes/Replay/RecordedCaseList';
import { ApplicationService, ScheduleService } from '@/services';
import { MessageMap } from '@/services/ScheduleService';

type AppTitleProps = {
  appId: string;
  appName?: string;
  readOnly?: boolean;
  recordCount?: number;
  onRefresh?: () => void;
  onQueryRecordCount?: () => void;
};

type CreatePlanForm = {
  targetEnv: string;
  caseSourceRange: [Dayjs, Dayjs];
  operationList?: string[];
};

const TitleWrapper = styled(
  (props: {
    appId: string;
    planId?: string;
    className?: string;
    title: ReactNode;
    count?: number;
    readOnly?: boolean;
    onClickTitle?: () => void;
    onRefresh?: () => void;
    onSetting?: () => void;
  }) => {
    const navPane = useNavPane();
    const { t } = useTranslation(['components']);
    const [planId, setPlanId] = useState<string>();

    useEffect(() => {
      setPlanId(props.planId);
    }, [props.planId]);

    return (
      <div id='arex-replay-record-detail-btn' className={props.className}>
        {props.title ? (
          <>
            {createElement(
              props.count ? Button : 'div',
              props.count ? { type: 'text', onClick: props.onClickTitle } : {},
              <Badge size='small' count={props.count} offset={[10, 2]}>
                <span style={{ fontSize: '20px', fontWeight: 600 }}>{props.title}</span>
              </Badge>,
            )}
            {props.onRefresh && (
              <TooltipButton
                id='arex-replay-refresh-report-btn'
                size='small'
                type='text'
                title={t('replay.refresh')}
                icon={<SyncOutlined />}
                onClick={props.onRefresh}
              />
            )}

            <Popover
              trigger={['click']}
              overlayStyle={{ width: '320px' }}
              overlayInnerStyle={{ padding: '8px' }}
              title={
                <div style={{ padding: '8px' }}>
                  <Typography.Text strong style={{ display: 'block' }}>
                    Agent Script :
                  </Typography.Text>
                  <Typography.Text code copyable>
                    {`java -javaagent:</path/to/arex-agent.jar> -Darex.service.name=${props.appId} -Darex.storage.service.host=<storage.service.host:port> -jar <your-application.jar>`}
                  </Typography.Text>
                </div>
              }
            >
              <Button size='small' type='text' icon={<CodeOutlined />} />
            </Popover>

            <CompareNoise appId={props.appId} readOnly={props.readOnly} />

            {props.onSetting && (
              <TooltipButton
                id='arex-replay-app-setting-btn'
                size='small'
                type='text'
                title={t('replay.appSetting')}
                icon={<SettingOutlined />}
                onClick={props.onSetting}
              />
            )}

            <Input.Search
              allowClear
              size='small'
              value={planId}
              placeholder={t('replay.searchForPlanId') as string}
              onChange={(e) => {
                setPlanId(e.target.value);
                !e.target.value &&
                  navPane({
                    id: props.appId,
                    type: PanesType.REPLAY,
                  });
              }}
              onSearch={(planId) => {
                navPane({
                  id: props.appId,
                  type: PanesType.REPLAY,
                  data: { planId: planId || undefined }, // set '' to undefined
                });
              }}
              style={{ display: 'inline', width: '160px', marginLeft: '8px' }}
            />
          </>
        ) : (
          <Skeleton.Input active size='small' style={{ width: '200px' }} />
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

const AppTitle: FC<AppTitleProps> = ({
  appId,
  appName,
  readOnly,
  recordCount = 0,
  onRefresh,
  onQueryRecordCount,
}) => {
  const { notification } = App.useApp();
  const { token } = theme.useToken();
  const navPane = useNavPane();
  const { t } = useTranslation(['components']);
  const email = getLocalStorage<string>(EMAIL_KEY);
  const { data } = useArexPaneProps<{ planId: string }>();

  const caseListRef = useRef<RecordedCaseListRef>(null);

  const [form] = Form.useForm<CreatePlanForm>();
  const targetEnv = Form.useWatch('targetEnv', form);

  const [open, setOpen] = useState(false);
  const [interfacesOptions, setInterfacesOptions] = useState<any[]>([]);

  const [targetHostSource, setTargetHostSource] = useLocalStorageState<{
    [appId: string]: string[];
  }>(TARGET_HOST_AUTOCOMPLETE_KEY, {
    defaultValue: {},
  });

  const appTitle = useMemo(
    () => appName && `${readOnly ? `[${t('readOnly', { ns: 'common' })}] ` : ''}${appName}`,
    [readOnly, t, appName],
  );

  const webhook = useMemo(
    () => `${location.origin}/schedule/createPlan?appId=${appId}&targetEnv=${targetEnv?.trim()}`,
    [appId, targetEnv],
  );

  /**
   * 请求 InterfacesList
   */
  useRequest(() => ApplicationService.queryInterfacesList<'Global'>({ appId }), {
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
  });

  const handleStartReplay = () => {
    form
      .validateFields()
      .then((values) => {
        const targetEnv = values.targetEnv.trim();
        createPlan({
          appId,
          sourceEnv: 'pro',
          targetEnv,
          caseSourceFrom: values.caseSourceRange[0].valueOf(),
          caseSourceTo: values.caseSourceRange[1].valueOf(),
          operationCaseInfoList: values.operationList?.map((operationId) => ({
            operationId,
          })),
          operator: email as string,
          replayPlanType: Number(Boolean(values.operationList?.length)),
        });

        // update targetHostSource
        setTargetHostSource((source) => {
          !source && (source = {});

          if (source?.[appId] && !source?.[appId].includes(targetEnv))
            source[appId].push(targetEnv);
          else if (!source?.[appId]) source[appId] = [targetEnv];

          return source;
        });
      })
      .catch((info) => {
        console.error('Validate Failed:', info);
      });
  };

  const targetHostOptions = useMemo(
    () =>
      targetHostSource?.[appId]?.map((item) => ({
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
                  const targetHostList = source?.[appId] || [];
                  const index = targetHostList.indexOf(item);
                  if (index > -1) {
                    targetHostList.splice(index, 1);
                  }
                  return {
                    ...source,
                    [appId]: targetHostList,
                  };
                });
              }}
            />
          </SpaceBetweenWrapper>
        ),
        value: item,
      })) || [],
    [appId, targetHostSource, open],
  );

  const handleClickTitle = useCallback(() => caseListRef.current?.open(), [caseListRef]);

  const handleRefresh = useCallback(() => {
    onQueryRecordCount?.();
    onRefresh?.();
  }, []);

  const handleSetting = useCallback(() => {
    navPane({
      id: appId,
      type: PanesType.APP_SETTING,
    });
  }, [appId]);

  const handleCloseModal = useCallback(() => {
    setOpen(false);
    form.resetFields();
  }, [form]);

  return (
    <div>
      <PanesTitle
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TitleWrapper
              appId={appId}
              planId={data?.planId}
              title={appTitle}
              readOnly={readOnly}
              count={recordCount}
              onClickTitle={handleClickTitle}
              onRefresh={handleRefresh}
              onSetting={handleSetting}
            />
          </div>
        }
        extra={
          <Button
            id='arex-replay-create-plan-btn'
            size='small'
            type='primary'
            disabled={readOnly}
            icon={<PlayCircleOutlined />}
            onClick={() => setOpen(true)}
          >
            {t('replay.startButton')}
          </Button>
        }
      />

      <Modal
        title={`${t('replay.startButton')} - ${appId}`}
        open={open}
        onOk={handleStartReplay}
        onCancel={handleCloseModal}
        styles={{
          body: { paddingBottom: '12px' },
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
            name='targetEnv'
            rules={[{ required: true, message: t('replay.emptyHost') as string }]}
          >
            <AutoComplete
              allowClear
              options={targetHostOptions}
              placeholder='e.g., https://<ip>:<port>'
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

      <RecordedCaseList ref={caseListRef} appId={appId} onChange={onQueryRecordCount} />
    </div>
  );
};

export default AppTitle;
