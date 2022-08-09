import { Space } from 'antd';
import React, { FC, useState } from 'react';

import Case from '../../components/replay/Case';
import CollapseTable from '../../components/styledComponents/CollapseTable';
import PanesTitle from '../../components/styledComponents/PanesTitle';
import { PlanItemStatistics } from '../../services/Replay.type';
import { ReplayCase as ReplayCaseType } from '../../services/Replay.type';

const ReplayCase: FC<{ data: PlanItemStatistics }> = ({ data }) => {
  const [selectedRecord, setSelectedRecord] = useState<ReplayCaseType>();

  const handleClickRecord = (record: ReplayCaseType) => {
    setSelectedRecord(selectedRecord?.recordId === record.replayId ? undefined : record);
  };
  return (
    <Space direction='vertical' style={{ display: 'flex' }}>
      <PanesTitle title={<span>Main Service API: {data.operationName}</span>} />

      <CollapseTable
        active={!!selectedRecord}
        table={<Case planItemId={data.planItemId} onClick={handleClickRecord} />}
        panel={<span>diff</span>}
      />
    </Space>
  );
};

export default ReplayCase;
