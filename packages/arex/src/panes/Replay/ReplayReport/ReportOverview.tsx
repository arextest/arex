import 'chart.js/auto';

import { Label, SpaceBetweenWrapper, useTranslation } from '@arextest/arex-core';
import { css } from '@emotion/react';
import { Col, Row, Space, Statistic, Tag, theme, Typography } from 'antd';
import React, { FC, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';

import { PlanStatistics } from '@/services/ReportService';

import LegendBlock from './LegendBlock';

export function getPercent(num: number, den: number, showPercentSign = true) {
  const value = num && den ? Math.floor((num / den) * 1000) / 10 : 0;
  return showPercentSign ? value + '%' : value;
}

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
} as const;

interface ReportOverViewProps {
  data?: PlanStatistics;
}
const ReportOverview: FC<ReportOverViewProps> = (props) => {
  const { t } = useTranslation('components');
  const { token } = theme.useToken();

  const countData = useMemo(
    () => [
      props.data?.successCaseCount || 0,
      props.data?.failCaseCount || 0,
      props.data?.errorCaseCount || 0,
      props.data?.waitCaseCount || 0,
    ],
    [props.data],
  );

  const countSum = useMemo(() => countData.reduce((a, b) => (a || 0) + (b || 0), 0), [countData]);

  const pieData = useMemo(
    () => ({
      labels: [t('replay.passed'), t('replay.failed'), t('replay.invalid'), t('replay.blocked')],
      datasets: [
        {
          data: countData,
          backgroundColor: [
            token.colorSuccessTextHover,
            token.colorErrorTextHover,
            token.colorInfoTextHover,
            token.colorWarningTextHover,
          ],
        },
      ],
    }),
    [countData],
  );

  return (
    <Row gutter={12}>
      <Col span={12}>
        <Statistic
          title={t('replay.passRate')}
          value={
            props.data ? getPercent(props.data.successCaseCount, props.data.totalCaseCount) : 0
          }
        />
        <div>
          <Label>{t('replay.reportId')}</Label>
          {props.data?.planId}
        </div>
        <div>
          <Label>{t('replay.results')}</Label>
          {props.data?.planName}
        </div>
        <div>
          <Label style={{ flex: 1, flexShrink: 1 }}>{t('replay.targetHost')}</Label>
          <Typography.Text
            ellipsis
            copyable
            css={css`
              .ant-typography-copy {
                opacity: 0;
                transition: opacity 200ms ease-in-out;
              }
              &:hover {
                .ant-typography-copy {
                  opacity: 1;
                }
              }
            `}
          >
            {props.data?.targetEnv}
          </Typography.Text>
        </div>
        <div>
          <Label>{t('replay.replayStartTime')}</Label>
          {new Date(props.data?.caseStartTime || '').toLocaleString() || '-'}
        </div>
        <div>
          <Label>{t('replay.replayEndTime')}</Label>
          {new Date(props.data?.caseEndTime || '').toLocaleString() || '-'}
        </div>
        <div>
          <Label>{t('replay.executor')}</Label>
          {props.data?.creator}
        </div>
        {props.data?.caseTags && (
          <div style={{ marginTop: '2px' }}>
            <Label>{t('replay.caseTags')}</Label>
            <Space>
              {Object.entries(props.data?.caseTags || {}).map(([key, value]) => (
                <Tag key={key}>
                  {key}:{value}
                </Tag>
              ))}
            </Space>
          </div>
        )}
      </Col>

      <Col span={12}>
        <Typography.Text type='secondary'>{t('replay.replayPassRate')}</Typography.Text>
        <SpaceBetweenWrapper>
          <div style={{ height: '180px', width: 'calc(100% - 160px)', padding: '16px 0' }}>
            <Pie data={pieData} options={pieOptions} />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              width: '160px',
              padding: '16px',
              marginTop: '24px',
            }}
          >
            <LegendBlock
              text={`${t('replay.passed')}: ${countData[0]}`}
              color={token.colorSuccessTextHover}
            />
            <LegendBlock
              text={`${t('replay.failed')}: ${countData[1]}`}
              color={token.colorErrorTextHover}
            />
            <LegendBlock
              text={`${t('replay.invalid')}: ${countData[2]}`}
              color={token.colorInfoTextHover}
            />
            <LegendBlock
              text={`${t('replay.blocked')}: ${countData[3]}`}
              color={token.colorWarningTextHover}
            />
            <Typography.Text strong type='secondary' style={{ marginTop: '8px' }}>
              {t('replay.totalCases')}: {countSum}
            </Typography.Text>
          </div>
        </SpaceBetweenWrapper>
      </Col>
    </Row>
  );
};

export default ReportOverview;
