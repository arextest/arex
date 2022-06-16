import {useState} from "react";
import Collection from "../components/Collection";
import {Col, Divider, Row, Select} from "antd";
const { Option } = Select;
const Header = () => {
  const [count, setCount] = useState(0);
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  return <div>





    <Row  style={{padding:'12px 12px 12px 12px'}}>
      <Col className="gutter-row" span={18} style={{lineHeight:'32px',fontWeight:'bolder'}}>
        AREX
      </Col>
      <Col className="gutter-row" span={6}>
        <div style={{textAlign:'right'}}>
          <Select placeholder={'请选择workspace'} style={{ width: 160 }} onChange={handleChange}>
            <Option value="jack">100099999</Option>
            <Option value="lucy">100088888</Option>
          </Select>
        </div>
      </Col>
    </Row>
    <Divider style={{margin:'0'}}/>
  </div>;
};

export default Header;
