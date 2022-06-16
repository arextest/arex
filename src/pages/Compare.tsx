import { useState } from "react";
import Collection from "../components/Collection";
import { Col, Divider, Row } from "antd";
import CompareBottomComponent from "../components/Http/CompareBottomComponent";
import Http from "../components/Http/index";

const Compare = () => {
  const [count, setCount] = useState(0);
  return (
    <div style={{ fontStyle: "12px" }}>
      <Row>
        <Col className="gutter-row" span={18}>
          <Http />
          <Divider />
          <CompareBottomComponent />
        </Col>
        <Col className="gutter-row" span={6}>
          <div>
            <Collection></Collection>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Compare;
