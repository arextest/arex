import { Col, Row } from "antd";
import { useState } from "react";

import Collection from "../components/Collection";
import Http from "../components/Http";
import { useStore } from "../store";

const Normal = () => {
  const theme = useStore((state) => state.theme);
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
        style={{
          borderRight: `1px solid ${theme === "light" ? "#f0f0f0" : "#303030"}`,
          paddingRight: "14px",
          paddingTop: "14px",
        }}
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
