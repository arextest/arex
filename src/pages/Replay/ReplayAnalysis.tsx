import { FC } from 'react';

import Analysis from '../../components/replay/Analysis';
import { PlanItemStatistics } from '../../services/Replay.type';

const ReplayAnalysis: FC<{ data: PlanItemStatistics }> = ({ data }) => {
  return (
    <>
      <h1>Main Service API: {data.operationName}</h1>
      <Analysis planItemId={data.planItemId} />
    </>
  );
};

export default ReplayAnalysis;
