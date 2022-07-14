import { useRequest } from "ahooks";
import { Col, Row } from "antd";
import React, { FC } from "react";

import ReplayService from "../../api/Replay.service";

const Analysis: FC<{ planItemId: number }> = ({ planItemId }) => {
  useRequest(() => ReplayService.queryResponseTypeStatistic({ planItemId }), {
    onSuccess(res) {
      console.log(res);
    },
  });

  return (
    <Row>
      <Col span={6}>Analysis, planItemId: {planItemId}</Col>
      <Col span={18}>Analysis, planItemId: {planItemId}</Col>
    </Row>
  );
};

export default Analysis;
