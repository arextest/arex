import { Col, Row } from "antd";

import Collection from "../components/Collection";
import Http from "../components/Http/index";

const Compare = () => {
  return (
    <Row>
      <Col span={18}         style={{ borderRight: "1px solid #f0f0f0", paddingRight: "14px",paddingTop:'14px' }}>
        <Http mode="compare" />
      </Col>
      <Col span={6}>
        <Collection />
      </Col>
    </Row>
  );
};

export default Compare;
