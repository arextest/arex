import { FC } from 'react';

import Analysis from '../../components/replay/Analysis';
import { PlanItemStatistics } from '../../services/Replay.type';
import PanesTitle from '../../components/styledComponents/PanesTitle';
import { Space } from 'antd';

const ReplayAnalysis: FC<{ data: PlanItemStatistics }> = ({ data }) => {
  return (
    <Space direction='vertical' style={{ display: 'flex' }}>
      <PanesTitle title={<span>Main Service API: {data.operationName}</span>} />
      <Analysis planItemId={data.planItemId} />
    </Space>
  );
};

export default ReplayAnalysis;
