import { Col, Row } from "antd";

import Collection from "../components/Collection";
import Http from "../components/Http/index";

const Compare = () => {
  return (
    <Row>
      <Col span={18}>
        <Http mode="compare" />
      </Col>
      <Col span={6}>
        <Collection />
      </Col>
    </Row>
  );
};

export default Compare;
