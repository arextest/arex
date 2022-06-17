import { Col, Row } from "antd";

import Collection from "../components/Collection";
import Http from "../components/Http";

const Normal = () => {
  return (
    <Row>
      <Col span={18}>
        <Http />
      </Col>
      <Col span={6}>
        <Collection />
      </Col>
    </Row>
  );
};

export default Normal;
