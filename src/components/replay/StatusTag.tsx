import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Progress, Tag } from 'antd';
import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const resultsStates = [
  { label: 'init', color: 'default', value: 0, icon: <ClockCircleOutlined /> },
  { label: 'running', color: 'processing', value: 1, icon: <SyncOutlined spin /> },
  { label: 'done', color: 'success', value: 2, icon: <CheckCircleOutlined /> },
  { label: 'interrupted', color: 'warning', value: 3, icon: <ExclamationCircleOutlined /> },
  { label: 'cancelled', color: 'error', value: 4, icon: <MinusCircleOutlined /> },
] as const;

export type StatusTagProps = {
  status: number;
  caseCount?: number | null;
  totalCaseCount?: number | null;
};

const StatusTag: FC<StatusTagProps> = (props) => {
  const { t } = useTranslation(['components']);

  const state = useMemo(() => resultsStates.find((s) => s.value === props.status), [props.status]);
  const icon = useMemo(
    () =>
      props.status === 1 && props.totalCaseCount ? (
        <Progress
          type='circle'
          percent={((props.caseCount || 0) * 100) / props.totalCaseCount}
          format={() =>
            `${(((props.caseCount || 0) / (props.totalCaseCount as number)) * 100).toFixed(2)}% ${
              props.caseCount
            } of ${props.totalCaseCount}`
          }
          size={12}
          style={{ marginRight: '7px' }}
        />
      ) : (
        state?.icon
      ),
    [props.status, props.caseCount, props.totalCaseCount, state],
  );

  return state ? (
    <Tag color={state.color} icon={icon}>
      {t('replay.' + state.label)}
    </Tag>
  ) : (
    <Tag>{t('replay.unknownState')}</Tag>
  );
};

export default StatusTag;
