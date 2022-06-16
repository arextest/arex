import {useState} from "react";
import Collection from "../components/Collection";
import {Col, Row} from "antd";
import Http from "../components/Http";
import t from './../assets/img/t.jpeg'

const Normal = () => {
  const [count, setCount] = useState(0);
  return <div style={{fontStyle:'12px'}}>
    <Row>
      <Col className="gutter-row" span={18}>
        <div>
          <img style={{width:'100%'}} src={t} alt=""/>
          <Http></Http>
        </div>
      </Col>
      <Col className="gutter-row" span={6}>
        <div>
          <Collection></Collection>
        </div>
      </Col>
    </Row>
  </div>;
};

export default Normal;
