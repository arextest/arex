import { useTranslation } from '@arextest/arex-core';
import { Card } from 'antd';
import * as React from 'react';
import { ReactElement, ReactNode } from 'react';

import { RunResult } from '@/panes/BatchRun/BatchRun';
import { GroupProps } from '@/panes/BatchRun/BatchRunResultGroup/common';

const SendAbnormal = 0b1;
const SendNormal = 0b1 << 1;
const TestNormal = 0b1 << 2;
const TestAbnormal = 0b1 << 3;

const SendAbnormalTestAbnormal = SendAbnormal | TestAbnormal;
const SendAbnormalTestNormal = SendAbnormal | TestNormal;
const SendNormalTestAbnormal = SendNormal | TestAbnormal;
const SendNormalTestNormal = SendNormal | TestNormal;

function buildStatusMap(blockMap: Map<RunResult, React.ReactElement>) {
  const statusMap = new Map<number, React.ReactElement[]>();
  for (const key of blockMap.keys()) {
    const { response } = key;
    const statusCode = response?.response?.statusCode ?? 0;
    const send = statusCode >= 200 && statusCode < 300 ? SendNormal : SendAbnormal;
    const test =
      // no case or all passed
      !response?.testResult?.length || response?.testResult?.every((t) => t.passed)
        ? TestNormal
        : TestAbnormal;

    const status = send | test;
    if (status === SendAbnormalTestAbnormal) {
      console.log('SendAbnormalTestAbnormal', key);
    }

    if (!statusMap.has(status)) {
      statusMap.set(status, []);
    }
    statusMap.get(status)!.push(blockMap.get(key)!);
  }
  return statusMap;
}

const GroupCard = (props: { title: string; children?: ReactElement[] }) => {
  return (
    <Card
      size='small'
      title={props.title}
      style={{ display: props.children?.length ? '' : 'none', marginBottom: 8 }}
    >
      <div style={{ display: 'flex', flexFlow: 'row wrap' }}>{props.children}</div>
    </Card>
  );
};

export function ByStatus(props: GroupProps) {
  const { t } = useTranslation('page');
  const { blockMap } = props;
  const statusMap = buildStatusMap(blockMap);
  return (
    <>
      <GroupCard title={t('batchRunPage.sendNormalTestAbnormal')}>
        {statusMap.get(SendNormalTestAbnormal)}
      </GroupCard>
      <GroupCard title={t('batchRunPage.sendAbnormalTestNormal')}>
        {statusMap.get(SendAbnormalTestNormal)}
      </GroupCard>
      <GroupCard title={t('batchRunPage.sendAbnormalTestAbnormal')}>
        {statusMap.get(SendAbnormalTestAbnormal)}
      </GroupCard>
      <GroupCard title={t('batchRunPage.sendNormalTestNormal')}>
        {statusMap.get(SendNormalTestNormal)}
      </GroupCard>
    </>
  );
}
