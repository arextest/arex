import { FC } from 'react';

import Analysis from '../../components/replay/Analysis';
import { PlanItemStatistics } from '../../services/Replay.type';

const ReplayAnalysis: FC<{ data: PlanItemStatistics }> = ({ data }) => {
  return <Analysis planItemId={data.planItemId} />;
};

export default ReplayAnalysis;
