import { Col, Row } from "antd";

import Collection from "../components/Collection";
import Http from "../components/Http";
import {useState} from "react";

const Normal = () => {
  const [selectedRequest,setSelectedRequest] = useState<{id:string,path:[]}>({
    id:'',
    path:[]
  })
  return (
    <Row>
      <Col span={18} >
        <div style={{borderRight:'1px solid #f0f0f0',paddingRight:'14px'}}>
          <Http selectedRequest={selectedRequest}/>
        </div>
      </Col>
      <Col span={6}>
        <Collection changeSelectedRequest={(r)=>{setSelectedRequest(r)}}/>
      </Col>
    </Row>
  );
};

export default Normal;
