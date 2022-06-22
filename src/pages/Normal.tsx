import { Col, Row } from "antd";
import { useState } from "react";

import Collection from "../components/Collection";
import Http from "../components/Http";

const Normal = () => {
  const [selectedRequest, setSelectedRequest] = useState<{
    id: string;
    path: string[];
  }>({
    id: "",
    path: [],
  });

  return (
    <Row>
      <Col
        lg={{ span: 18 }}
        md={{ span: 16 }}
        style={{ borderRight: "1px solid #f0f0f0", paddingRight: "14px" }}
      >
        <Http id={selectedRequest.id} path={selectedRequest.path} />
      </Col>
      <Col lg={{ span: 6 }} md={{ span: 8 }}>
        <Collection
          changeSelectedRequest={(r) => {
            setSelectedRequest(r);
          }}
        />
      </Col>
    </Row>
  );
};

export default Normal;
