import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Tag } from 'antd';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const resultsStates = [
  { label: 'init', color: 'default', value: 0, icon: <ClockCircleOutlined /> },
  { label: 'running', color: 'processing', value: 1, icon: <SyncOutlined spin /> },
  { label: 'done', color: 'success', value: 2, icon: <CheckCircleOutlined /> },
  { label: 'interrupted', color: 'warning', value: 3, icon: <ExclamationCircleOutlined /> },
  { label: 'cancelled', color: 'error', value: 4, icon: <MinusCircleOutlined /> },
] as const;

const StatusTag: FC<{ status: number }> = (props) => {
  const { t } = useTranslation(['components']);

  const state = resultsStates.find((s) => s.value === props.status);
  return state ? (
    <Tag color={state.color} icon={state.icon}>
      {t('replay.' + state.label)}
    </Tag>
  ) : (
    <Tag>{t('replay.unknownState')}</Tag>
  );
};

export default StatusTag;
