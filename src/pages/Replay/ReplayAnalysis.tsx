import { Space } from 'antd';
import { FC } from 'react';

import Analysis from '../../components/replay/Analysis';
import PanesTitle from '../../components/styledComponents/PanesTitle';
import { PlanItemStatistics } from '../../services/Replay.type';

const ReplayAnalysis: FC<{ data: PlanItemStatistics }> = ({ data }) => {
  return (
    <Space direction='vertical' style={{ display: 'flex' }}>
      <PanesTitle title={<span>Main Service API: {data.operationName}</span>} />
      <Analysis planItemId={data.planItemId} />
    </Space>
  );
};

export default ReplayAnalysis;
