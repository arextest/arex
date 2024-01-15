import {
  DeleteOutlined,
  DownOutlined,
  ExclamationCircleFilled,
  RedoOutlined,
  ShareAltOutlined,
  StopOutlined,
} from '@ant-design/icons';
import {
  copyToClipboard,
  css,
  Label,
  TooltipButton,
  useArexPaneProps,
  useTranslation,
} from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Button, Card, Dropdown, Select, Space, Tag } from 'antd';
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react';

import { Icon, StatusTag } from '@/components';
import { ResultsState } from '@/components/StatusTag';
import { ReportService, ScheduleService } from '@/services';
import { PlanStatistics } from '@/services/ReportService';
import { ReRunPlanReq } from '@/services/ScheduleService';

export interface ReportCardProps {
  appId: string;
  planId?: string;
  planItemId?: string;
  readOnly?: boolean;
  children: React.ReactNode;
  onReportChange?: (plan: PlanStatistics) => void;
  onTerminateReplay?: (planId: string) => void;
  onDeleteReport?: (planId: string) => void;
  onLogsClick?: () => void;
}

export interface ReportCardRef {
  query: (selectFirst?: boolean) => void;
  create: (req: ReRunPlanReq) => void;
}
const ReportCard = forwardRef<ReportCardRef, ReportCardProps>((props, ref) => {
  const { t } = useTranslation('components');
  const { modal, message } = App.useApp();
  const { data } = useArexPaneProps<{ planId?: string }>();

  const [init, setInit] = useState(true);

  const {
    data: { list: planStatistics } = {
      list: [],
    },
    run: queryPlanStatistics,
    cancel: cancelPollingInterval,
  } = useRequest(
    (selectFirst?: boolean) =>
      ReportService.queryPlanStatistics({
        appId: props.appId,
        planId: data?.planId || undefined,
        current: 1,
        pageSize: 8,
      }),
    {
      ready: !!props.appId,
      pollingInterval: 6000,
      refreshDeps: [props.appId, data?.planId],
      onSuccess({ list }, [selectFirst]) {
        if (init || selectFirst) {
          list.length && props.onReportChange?.(list[0]);
          setInit(false); // 设置第一次初始化标识);
        }
        if (
          list.every(
            (record) => ![ResultsState.RUNNING, ResultsState.RERUNNING].includes(record.status),
          )
        ) {
          // setPollingInterval(false);
          cancelPollingInterval();
        }
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
    onSuccess(success) {
      if (success) {
        message.success(t('message.success', { ns: 'common' }));
        queryPlanStatistics();
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
        queryPlanStatistics(true);
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
    ],
    [t],
  );

  const extraMenuHandler = useCallback(
    ({ key }: { key: string }) => {
      switch (key) {
        case 'terminateReplay': {
          if (props.planId) terminateReplay(props.planId);
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

  return (
    <Card
      // size='small'
      // bordered={false}
      title={
        <>
          <Label>{t('replay.report')}</Label>
          <Select
            suffixIcon={
              <span>
                {t('replay.moreReport')} <DownOutlined />
              </span>
            }
            bordered={false}
            value={props.planId}
            options={planStatistics.map((item, index) => ({
              label: (
                <Space>
                  <span style={{ marginRight: '8px' }}>{item.planName}</span>
                  <StatusTag
                    status={item.status}
                    caseCount={item.successCaseCount + item.failCaseCount + item.errorCaseCount}
                    totalCaseCount={item.totalCaseCount}
                    message={item.errorMessage}
                  />
                  {!data?.planId && index === 0 && (
                    <Tag icon={<Icon name='Sparkles' size={10} style={{ marginRight: '6px' }} />}>
                      {t('replay.latest')}
                    </Tag>
                  )}
                </Space>
              ),
              value: item.planId,
              record: item,
            }))}
            popupMatchSelectWidth={false}
            onChange={(value) => {
              const selected = planStatistics.find((item) => item.planId === value);
              if (selected) props.onReportChange?.(selected);
            }}
            css={css`
              .ant-select-selection-item {
                font-weight: 600;
                padding-inline-end: 72px !important;
              }
            `}
          />
          <TooltipButton
            size='small'
            type='link'
            title={t('share', { ns: 'common' })}
            icon={<ShareAltOutlined />}
            onClick={handleSharePlan}
          />
        </>
      }
      extra={
        <Space>
          <Button
            type='link'
            size='small'
            icon={<Icon name='ScrollText' />}
            disabled={props.readOnly}
            onClick={props.onLogsClick}
          >
            {t('replay.logs')}
          </Button>

          <Dropdown.Button
            size='small'
            type='link'
            disabled={props.readOnly}
            loading={retrying}
            trigger={['click']}
            menu={{
              items: extraMenuItems,
              onClick: extraMenuHandler,
            }}
            onClick={() => {
              if (props.planId) reRunPlan({ planId: props.planId });
            }}
          >
            <RedoOutlined />
            {t('replay.rerun')}
          </Dropdown.Button>
        </Space>
      }
    >
      {props.children}
    </Card>
  );
});

export default ReportCard;
