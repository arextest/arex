import { useState } from "react";
import Collection from "../components/Collection";
import { Col, Row, Select } from "antd";
const { Option } = Select;
const Header = () => {
  const [count, setCount] = useState(0);
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  return <div style={{fontStyle:'12px'}}>





    <Row>
      <Col className="gutter-row" span={18}>
        <div>AREX</div>
      </Col>
      <Col className="gutter-row" span={6}>
        <div style={{textAlign:'right'}}>
          <Select placeholder={'请选择workspace'} style={{ width: 160 }} onChange={handleChange}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
          </Select>
        </div>
      </Col>
    </Row>
  </div>;
};

export default Header;
