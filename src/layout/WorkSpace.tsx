import { Col, Row } from "antd";
import { FC, ReactNode } from "react";

import { useStore } from "../store";

const WorkSpace: FC<{ Main: ReactNode; Side: ReactNode }> = ({
  Main,
  Side,
}) => {
  const theme = useStore((state) => state.theme);

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
        {Main}
      </Col>
      <Col lg={{ span: 6 }} md={{ span: 8 }}>
        {Side}
      </Col>
    </Row>
  );
};

export default WorkSpace;
