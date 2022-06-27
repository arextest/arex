import { Col, Row } from "antd";
import { useState } from "react";

import Collection from "../components/Collection";
import Http from "../components/Http";
import { useStore } from "../store";

const Compare = () => {
  const theme = useStore((state) => state.theme);
  const [selectedRequest, setSelectedRequest] = useState<{
    id: string;
    path: string[];
  }>({
    id: "",
    path: [],
  });

  return (
    <Row style={{ height: "100%" }}>
      <Col
        lg={{ span: 18 }}
        md={{ span: 16 }}
        style={{
          borderRight: `1px solid ${theme === "light" ? "#f0f0f0" : "#303030"}`,
          paddingRight: "14px",
          paddingTop: "14px",
        }}
      >
        <Http mode={'compare'} id={selectedRequest.id} path={selectedRequest.path} />
      </Col>
      <Col lg={{ span: 6 }} md={{ span: 8 }}>
        <Collection
          changeSelectedRequest={(r) => {
            console.log(r)
            setSelectedRequest(r);
          }}
        />
      </Col>
    </Row>
  );
};

export default Compare;
