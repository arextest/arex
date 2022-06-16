import {useState} from "react";
import Collection from "../components/Collection";
import {Col, Row} from "antd";

const Compare = () => {
  const [count, setCount] = useState(0);
  return <div style={{fontStyle:'12px'}}>
    <Row>
      <Col className="gutter-row" span={18}>
        <div>http</div>
      </Col>
      <Col className="gutter-row" span={6}>
        <div>
          <Collection></Collection>
        </div>
      </Col>
    </Row>
  </div>;
};

export default Compare;
