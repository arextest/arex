import { Col, Row } from "antd";
import { useState } from "react";

import { Root, RootParadigmKey } from "../api/FileSystem.type";
import { Collection, Http } from "../components";
import { useStore } from "../store";

const Normal = () => {
  const theme = useStore((state) => state.theme);
  const [selectedRequest, setSelectedRequest] = useState<{
    id: string;
    path: Root<RootParadigmKey>[];
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
        <Http id={selectedRequest.id} path={selectedRequest.path} />
      </Col>
      <Col lg={{ span: 6 }} md={{ span: 8 }}>
        <Collection changeSelectedRequest={setSelectedRequest} />
      </Col>
    </Row>
  );
};

export default Normal;
