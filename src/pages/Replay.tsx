import { Empty, Space } from 'antd';
import React, { FC, useState } from 'react';

import { ApplicationDataType, PlanStatistics } from '../api/Replay.type';
import { AppTitle, Report, Results } from '../components/replay';
import { FlexCenterWrapper } from '../components/styledComponents';

const Replay: FC<{ data?: ApplicationDataType }> = ({ data }) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanStatistics>();
  return data ? (
    <Space direction='vertical' size='middle' style={{ display: 'flex' }}>
      <AppTitle data={{ id: data.appId, name: data.appName, count: data.recordedCaseCount }} />

      <Results
        // defaultSelectFirst
        appId={data.appId}
        onSelectedPlanChange={setSelectedPlan}
      />

      <Report selectedPlan={selectedPlan} />

      {/* TODO Configuration */}
    </Space>
  ) : (
    <FlexCenterWrapper>
      <Empty description={'Please select an application'} />
    </FlexCenterWrapper>
  );
};

export default Replay;
