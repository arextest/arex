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
  Collapse,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popover,
  Skeleton,
  theme,
  Typography,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { createElement, FC, ReactNode, useCallback, useMemo, useRef, useState } from 'react';

import { InterfaceSelect, TagSelect } from '@/components';
import { EMAIL_KEY, isClient, PanesType, TARGET_HOST_AUTOCOMPLETE_KEY } from '@/constant';
import { useNavPane } from '@/hooks';
import { ScheduleService } from '@/services';
import { CaseTags, MessageMap } from '@/services/ScheduleService';

import CompareNoise from './CompareNoise';
import RecordedCaseList, { RecordedCaseRef } from './RecordedCase';

type AppTitleProps = {
  appId: string;
  appName?: string;
  readOnly?: boolean;
  recordCount?: number;
  tags?: Record<string, string[]>;
  onRefresh?: () => void;
  onQueryRecordCount?: () => void;
};

type CreatePlanForm = {
  planName?: string;
  targetEnv: string;
  caseSourceRange: [Dayjs, Dayjs];
  operationList?: string[];
  caseCountLimit?: number;
  caseTags?: CaseTags;
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
    const { t } = useTranslation(['components']);

    return (
      <div
        id='arex-replay-record-detail-btn'
        className={props.className}
        style={{ paddingLeft: '4px' }}
      >
        {props.title ? (
          <>
            {createElement(
              props.count ? Button : 'div',
              props.count
                ? { type: 'text', onClick: props.onClickTitle }
                : { style: { padding: '6px 12px 0' } },
              <Badge size='small' count={props.count} offset={[8, 2]}>
                <Typography.Title level={4}>{props.title}</Typography.Title>
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
  tags,
  onRefresh,
  onQueryRecordCount,
}) => {
  const { notification } = App.useApp();
  const { token } = theme.useToken();
  const navPane = useNavPane();
  const { t } = useTranslation(['components']);
  const email = getLocalStorage<string>(EMAIL_KEY);
  const { data } = useArexPaneProps<{ planId: string }>();

  const caseListRef = useRef<RecordedCaseRef>(null);

  const [form] = Form.useForm<CreatePlanForm>();
  const targetEnv = Form.useWatch('targetEnv', form);
  const planName = Form.useWatch('planName', form);
  const caseSourceRange = Form.useWatch('caseSourceRange', form);
  const operationList = Form.useWatch('operationList', form);
  const caseCountLimit = Form.useWatch('caseCountLimit', form);

  const [openPathDropdown, setOpenPathDropdown] = useState(false);

  const [targetHostSource, setTargetHostSource] = useLocalStorageState<{
    [appId: string]: string[];
  }>(TARGET_HOST_AUTOCOMPLETE_KEY, {
    defaultValue: {},
  });

  const appTitle = useMemo(
    () => appName && `${readOnly ? `[${t('readOnly', { ns: 'common' })}] ` : ''}${appName}`,
    [readOnly, t, appName],
  );

  const webhook = useMemo(() => {
    const url = new URL(`${location.origin}/schedule/createPlan`);

    url.searchParams.append('appId', appId);
    targetEnv && url.searchParams.append('targetEnv', targetEnv.trim());
    planName && url.searchParams.append('planName', planName.trim());
    if (caseSourceRange && caseSourceRange?.length === 2) {
      url.searchParams.append('caseSourceFrom', caseSourceRange[0].valueOf().toString());
      url.searchParams.append('caseSourceTo', caseSourceRange[1].valueOf().toString());
    }
    operationList?.length && url.searchParams.append('operationIds', operationList.join(','));
    typeof caseCountLimit === 'number' &&
      url.searchParams.append('caseCountLimit', caseCountLimit.toString());
    return url.toString();
  }, [appId, targetEnv, planName, caseSourceRange, operationList, caseCountLimit]);

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
        setOpenPathDropdown(false);
        form.resetFields();
      },
    },
  );

  const handleStartReplay = () => {
    form
      .validateFields()
      .then((values) => {
        const targetEnv = values.targetEnv.trim();

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
    [appId, targetHostSource, openPathDropdown],
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
      name: appName,
    });
  }, [appId]);

  const handleCloseModal = useCallback(() => {
    setOpenPathDropdown(false);
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
            onClick={() => setOpenPathDropdown(true)}
          >
            {t('replay.startButton')}
          </Button>
        }
      />

      <Modal
        title={`${t('replay.startButton')} - ${appId}`}
        open={openPathDropdown}
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
                        open={openPathDropdown}
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

      <RecordedCaseList ref={caseListRef} appId={appId} onChange={onQueryRecordCount} />
    </div>
  );
};

export default AppTitle;
