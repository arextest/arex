import { css } from '@emotion/react';
import { Collapse, Empty, Space } from 'antd';
import React, { FC, useState } from 'react';

import { AppTitle, Report, Results } from '../../components/replay';
import { FlexCenterWrapper } from '../../components/styledComponents';
import { ApplicationDataType, PlanStatistics } from '../../services/Replay.type';

const { Panel } = Collapse;

const Replay: FC<{ data?: ApplicationDataType }> = ({ data }) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanStatistics>();
  const onChange = (key: string | string[]) => {
    console.log(key);
  };
  const handleSelectPlan = (plan: PlanStatistics) => {
    plan.planId === selectedPlan?.planId ? setSelectedPlan(undefined) : setSelectedPlan(plan);
  };
  return data ? (
    <Space direction='vertical' size='middle' style={{ display: 'flex' }}>
      <AppTitle data={{ id: data.appId, name: data.appName, count: data.recordedCaseCount }} />

      <Collapse
        activeKey={selectedPlan && 'report'}
        onChange={onChange}
        css={css`
          .ant-collapse-header {
            cursor: default !important;
            //background: #fff !important;
          }
          .ant-collapse-content-box {
            padding-top: 0 !important;
            .ant-card-head-title {
              font-size: 16px;
            }
          }
        `}
      >
        <Panel
          key='report'
          showArrow={false}
          header={
            <Results
              // defaultSelectFirst
              appId={data.appId}
              onSelectedPlanChange={handleSelectPlan}
            />
          }
        >
          <Report selectedPlan={selectedPlan} />
        </Panel>
      </Collapse>

      {/* TODO Configuration */}
    </Space>
  ) : (
    <FlexCenterWrapper>
      <Empty description={'Please select an application'} />
    </FlexCenterWrapper>
  );
};

export default Replay;
