import { FC } from 'react';

import Case from '../../components/replay/Case';
import { PlanItemStatistics } from '../../services/Replay.type';

const ReplayCase: FC<{ data: PlanItemStatistics }> = ({ data }) => {
  return <Case planItemId={data.planItemId} />;
};

export default ReplayCase;
