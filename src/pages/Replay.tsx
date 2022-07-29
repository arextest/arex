import styled from '@emotion/styled';
import { Button, Empty, Space } from 'antd';
import React, { FC, useState } from 'react';

import { ApplicationDataType, PlanStatistics } from '../api/Replay.type';
import { Report, Results } from '../components/replay';
import { FlexCenterWrapper } from '../components/styledComponents';

const AppTitle = styled.div`
  height: 22px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .app-name {
    margin: 0 auto 0 0;
  }
  & > *:not(.app-name) {
    margin-left: 16px;
  }
`;

const Replay: FC<{ curApp?: ApplicationDataType }> = ({ curApp }) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanStatistics>();
  return curApp ? (
    <Space direction='vertical' size='middle' style={{ display: 'flex' }}>
      <AppTitle>
        <h1 className='app-name'>{`${curApp.appId}_${curApp.appName}`}</h1>
        <span>
          <label>Case Count: </label>
          <span>{curApp.recordedCaseCount}</span>
        </span>
        <Button size='small' type='primary'>
          Start replay
        </Button>
      </AppTitle>
      {/* Report component  */}
      <Results
        // defaultSelectFirst
        appId={curApp.appId}
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
