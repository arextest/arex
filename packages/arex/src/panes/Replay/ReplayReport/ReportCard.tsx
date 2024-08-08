import AntdIcon, {
  DeleteOutlined,
  ExclamationCircleFilled,
  RedoOutlined,
  ShareAltOutlined,
  StopOutlined,
} from '@ant-design/icons';
import {
  copyToClipboard,
  css,
  EmptyWrapper,
  getLocalStorage,
  Label,
  SmallTextButton,
  useArexPaneProps,
  useTranslation,
} from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import {
  App,
  Badge,
  Card,
  Dropdown,
  Flex,
  Pagination,
  Select,
  Space,
  Tag,
  theme,
  Typography,
} from 'antd';
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react';

import { Icon, StatusTag } from '@/components';
import { ResultsState } from '@/components/StatusTag';
import { EMAIL_KEY } from '@/constant';
import { useNavPane } from '@/hooks';
import { ReportService, ScheduleService } from '@/services';
import { PlanStatistics } from '@/services/ReportService';
import { ReRunPlanReq } from '@/services/ScheduleService';
import { decodePaneKey } from '@/store/useMenusPanes';

import ProportionBarChart from './ProportionBarChart';

export interface ReportCardProps {
  appId: string;
  planId?: string;
  planItemId?: string;
  readOnly?: boolean;
  children: React.ReactNode;
  onChange?: (plan: PlanStatistics) => void;
  onTerminate?: (planId: string) => void;
  onDelete?: (planId: string) => void;
  onQueryPlan?: () => void;
  onClickLogs?: () => void;
}

export interface ReportCardRef {
  query: () => void;
  create: (req: ReRunPlanReq) => void;
}
const ReportCard = forwardRef<ReportCardRef, ReportCardProps>((props, ref) => {
  const { data, paneKey } = useArexPaneProps<{ planId?: string }>();
  const { id, type } = decodePaneKey(paneKey);
  const { t } = useTranslation('components');
  const { modal, message } = App.useApp();
  const { token } = theme.useToken();
  const navPane = useNavPane();
  const email = getLocalStorage<string>(EMAIL_KEY);

  const [reportSelectOpen, setReportSelectOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<PlanStatistics>();

  const [init, setInit] = useState(true);
  const [current, setCurrent] = useState(1);

  const {
    data: { list: planStatistics, pagination } = {
      list: [],
      pagination: {
        current: 1,
        pageSize: 8,
      },
    },
    run: queryPlanStatistics,
    cancel: cancelPollingInterval,
  } = useRequest(
    () =>
      ReportService.queryPlanStatistics({
        appId: props.appId,
        planId: data?.planId || undefined,
        current,
        pageSize: 8,
      }),
    {
      ready: !!props.appId,
      pollingInterval: 3000,
      refreshDeps: [props.appId, data?.planId, current],
      onSuccess({ list }) {
        if (init) {
          setInit(false); // 设置第一次初始化标识
        } else {
          props.onQueryPlan?.();
        }

        let plan = undefined;

        plan = list.find((item) => item.planId === props.planId);
        list.length && props.onChange?.(plan || list[0]);

        setSelectedReport(plan);

        if (
          ![ResultsState.INIT, ResultsState.RUNNING, ResultsState.RERUNNING].includes(
            plan?.status || selectedReport?.status || ResultsState.DONE,
          )
        )
          cancelPollingInterval();
      },
    },
  );

  const { run: reRunPlan, loading: retrying } = useRequest(ScheduleService.reRunPlan, {
    manual: true,
    onSuccess(res) {
      if (res.result === 1) {
        message.success(t('message.success', { ns: 'common' }));
        queryPlanStatistics();
      } else {
        message.error(res.desc);
      }
    },
  });

  useImperativeHandle(
    ref,
    () => ({
      query: queryPlanStatistics,
      create: reRunPlan,
    }),
    [],
  );

  const { run: terminateReplay } = useRequest(ScheduleService.stopPlan, {
    manual: true,
    ready: !!props.planId,
    onSuccess(success, [{ planId }]) {
      if (success) {
        message.success(t('message.success', { ns: 'common' }));
        queryPlanStatistics();
        props.onTerminate?.(planId);
      } else {
        message.error(t('message.error', { ns: 'common' }));
      }
    },
  });

  const { run: deleteReport } = useRequest(ReportService.deleteReport, {
    manual: true,
    ready: !!props.planId,
    onSuccess(success, [planId]) {
      if (success) {
        message.success(t('message.success', { ns: 'common' }));
        queryPlanStatistics();
        props.onDelete?.(planId);
      } else {
        message.error(t('message.error', { ns: 'common' }));
      }
    },
  });

  const extraMenuItems = useMemo(
    () => [
      {
        key: 'terminateReplay',
        label: t('replay.terminateTheReplay'),
        icon: <StopOutlined />,
      },
      {
        key: 'deleteReport',
        label: t('replay.deleteTheReport'),
        icon: <DeleteOutlined />,
      },
      {
        key: 'shareReport',
        label: t('replay.shareReport'),
        icon: <ShareAltOutlined />,
      },
    ],
    [t],
  );

  const extraMenuHandler = useCallback(
    ({ key }: { key: string }) => {
      switch (key) {
        case 'terminateReplay': {
          if (props.planId) terminateReplay({ planId: props.planId, operator: email });
          break;
        }
        case 'deleteReport': {
          modal.confirm({
            maskClosable: true,
            title: t('replay.confirmDeleteReport'),
            icon: <ExclamationCircleFilled />,
            okType: 'danger',
            onOk() {
              if (props.planId) deleteReport(props.planId);
            },
          });
          break;
        }
        case 'shareReport': {
          handleSharePlan();
          break;
        }
      }
    },
    [props.planId],
  );

  const handleSharePlan = () => {
    if (props.planId) {
      copyToClipboard(
        window.location.origin +
          window.location.pathname +
          `?planId=${props.planId}` +
          (props.planItemId ? `&planItemId=${props.planItemId}` : ''),
      );
      message.success(t('message.copySuccess', { ns: 'common' }));
    } else {
      message.warning(t('message.copyFailed', { ns: 'common' }));
    }
  };

  const handleResetUrlQuery = () => {
    // remove query data in the url
    navPane({
      id,
      type,
      data: {},
    });
  };

  return (
    <EmptyWrapper bordered loading={init} empty={!planStatistics.length}>
      <Card
        // size='small'
        title={
          <Flex align='center'>
            <Select
              variant='borderless'
              open={reportSelectOpen}
              suffixIcon={
                <span>
                  {t('replay.moreReport')}
                  {/* <DownOutlined /> // Icon unable to propagation */}
                  <span style={{ fontSize: '8px', marginLeft: '2px' }}>
                    {reportSelectOpen ? '▲' : '▼'}
                  </span>
                </span>
              }
              value={props.planId}
              options={planStatistics.map((item, index) => ({
                label:
                  !data?.planId && current === 1 && index === 0 ? (
                    <Badge
                      offset={[0, -1]}
                      count={
                        <AntdIcon
                          component={() => <>{t('new', { ns: 'common' })}</>}
                          style={{ color: token.colorPrimaryText, fontSize: 8, zIndex: 10 }}
                        />
                      }
                    >
                      <span style={{ marginRight: '8px' }}>{item.planName}</span>
                    </Badge>
                  ) : (
                    item.planName
                  ),
                value: item.planId,
                record: item,
              }))}
              popupMatchSelectWidth={false}
              optionRender={(item) => (
                <Space
                  css={css`
                    width: 100%;
                    .ant-space-item:last-of-type {
                      margin-left: auto;
                    }
                  `}
                >
                  <Typography.Text ellipsis style={{ width: '220px' }}>
                    {item.label}
                  </Typography.Text>

                  <StatusTag
                    status={item.data.record.status}
                    caseCount={
                      item.data.record.successCaseCount +
                      item.data.record.failCaseCount +
                      item.data.record.errorCaseCount
                    }
                    totalCaseCount={item.data.record.totalCaseCount}
                    message={item.data.record.errorMessage}
                  />

                  <div style={{ marginLeft: 'auto' }}>
                    <ProportionBarChart
                      // percent
                      data={[
                        item.data.record.successCaseCount || 0,
                        item.data.record.failCaseCount || 0,
                        item.data.record.errorCaseCount || 0,
                        item.data.record.waitCaseCount || 0,
                      ]}
                    />
                  </div>
                </Space>
              )}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div style={{ padding: '4px', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      {data?.planId && (
                        <>
                          <Label type='secondary'>{t('common:filter')}</Label>
                          <Tag closable onClose={handleResetUrlQuery}>
                            {data?.planId}
                          </Tag>
                        </>
                      )}
                    </div>

                    <Pagination
                      size='small'
                      showSizeChanger={false}
                      showTotal={(total) => `${t('common:total')}: ${total}`}
                      simple={{ readOnly: true }}
                      defaultCurrent={1}
                      total={pagination.total}
                      onChange={(page) => {
                        setCurrent(page);
                      }}
                      css={css`
                        li {
                          line-height: 21px !important;
                        }
                      `}
                    />
                  </div>
                </>
              )}
              onChange={(value) => {
                const selected = planStatistics.find((item) => item.planId === value);
                setSelectedReport(selected);
                if (selected) {
                  props.onChange?.(selected);
                  if (
                    [ResultsState.INIT, ResultsState.RUNNING, ResultsState.RERUNNING].includes(
                      selected.status,
                    )
                  )
                    queryPlanStatistics();
                  else cancelPollingInterval();
                }
              }}
              onDropdownVisibleChange={setReportSelectOpen}
              css={css`
                .ant-select-selector:hover {
                  background: ${token.colorBgTextHover};
                }
                .ant-select-selection-item {
                  font-weight: 600;
                  padding-inline-end: 64px !important;
                }
              `}
            />

            {selectedReport && (
              <div style={{ marginLeft: '4px' }}>
                <StatusTag
                  status={selectedReport.status}
                  caseCount={
                    selectedReport.successCaseCount +
                    selectedReport.failCaseCount +
                    selectedReport.errorCaseCount
                  }
                  totalCaseCount={selectedReport.totalCaseCount}
                  message={selectedReport.errorMessage}
                />
              </div>
            )}
          </Flex>
        }
        styles={{
          header: { padding: '0 9px' },
        }}
        extra={
          <Space>
            <SmallTextButton
              type='text'
              size='small'
              title={t('replay.logs')}
              icon={<Icon name='ScrollText' />}
              disabled={props.readOnly}
              onClick={props.onClickLogs}
            />

            <Dropdown.Button
              size='small'
              type='text'
              disabled={props.readOnly}
              loading={retrying}
              trigger={['click']}
              menu={{
                items: extraMenuItems,
                onClick: extraMenuHandler,
              }}
              onClick={() => props.planId && reRunPlan({ planId: props.planId })}
            >
              <RedoOutlined />
              {t('replay.rerun')}
            </Dropdown.Button>
          </Space>
        }
      >
        {props.children}
      </Card>
    </EmptyWrapper>
  );
});

export default ReportCard;
