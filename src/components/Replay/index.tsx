import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Button, Empty, Space, Tag } from "antd";
import React, { FC, useState } from "react";

import { ApplicationDataType, PlanStatistics } from "../../api/FileSystem.type";
import { FlexCenterWrapper } from "../StyledComponents";
import Report from "./Report";
import Results from "./Results";

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
    <Space direction="vertical" size="middle" style={{ display: "flex" }}>
      <AppTitle>
        <h1 className="app-name">{`${curApp.appId}_${curApp.appName}`}</h1>
        {/* <span> */}
        {/*  <label>Access CI: </label> */}
        {/*  <Tag */}
        {/*    css={css` */}
        {/*      height: 18px; */}
        {/*      line-height: 18px; */}
        {/*      border-radius: 8px; */}
        {/*    `} */}
        {/*  > */}
        {/*    {(curApp.features & 1) === 1 ? "ON" : "OFF"} */}
        {/*  </Tag> */}
        {/* </span> */}
        <span>
          <label>Case Count: </label>
          <span>{curApp.recordedCaseCount}</span>
        </span>
        <Button size="small">Start replay</Button>
      </AppTitle>

      {/* Report component  */}
      <Results appId={curApp.appId} onSelectedPlanChange={setSelectedPlan} />
      <Report selectedPlan={selectedPlan} />

      {/* TODO Configuration */}
    </Space>
  ) : (
    <FlexCenterWrapper>
      <Empty description={"Please select an application"} />
    </FlexCenterWrapper>
  );
};

export default Replay;
