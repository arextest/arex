import { useState } from "react";
import Collection from "../components/Collection";
import { Col, Row } from "antd";
import Http from "../components/Http";
import BottomComponent from "../components/Http/BottomComponent";

const Normal = () => {
  const [count, setCount] = useState(0);
  return (
    <div style={{ fontStyle: "12px" }}>
      <Row>
        <Col className="gutter-row" span={18}>
          <div>
            <Http />
            <BottomComponent />
          </div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div>
            <Collection />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Normal;
