import { css } from "@emotion/react";
import { Card, Col, Row, Space, Statistic } from "antd";
import { FC } from "react";

import { PlanStatistics } from "../../api/FileSystem.type";

const Report: FC<{ selectedPlan?: PlanStatistics }> = ({ selectedPlan }) => {
  return selectedPlan ? (
    <Card size="small" title={"Report: " + selectedPlan.planName}>
      <Row gutter={12}>
        <Col span={12}>
          {/* <Card size="small"> */}
          <div
            css={css`
              display: flex;
              & > * {
                flex: 1;
              }
            `}
          >
            <Statistic title="Pass Rate" value={112893} />
            <Statistic title="API Pass Rate" value={112893} />
          </div>

          <div>Report: Name spring-demo_0627_08:05</div>
          <div>Target: Host http://10.5.122.70:8088</div>
          <div>Executor: Visitor</div>
          <div>Record version: 0.0.1</div>
          <div>Replay version: 0.0.1</div>
          {/* </Card> */}
        </Col>
        <Col span={12}>
          {/* <Card size="small" style={{ height: "100%" }}> */}
          Chart
          {/* </Card> */}
        </Col>
      </Row>
    </Card>
  ) : (
    <></>
  );
};

export default Report;
