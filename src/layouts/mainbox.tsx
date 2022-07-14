import AppHeader from "../components/app/Header";
import ComparePage from "../pages/compare";
import RequestPage from "../pages/request";
import { Button, Col, Layout, Menu, Popconfirm, Row, Space, Spin } from "antd";
import MenuItem from "antd/es/menu/MenuItem";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import Collection from "../components/collection";
import Environment from "../components/environment";
import { useEffect } from "react";
import { useUser } from "../services/WorkspaceService";

// 数据状态全部定义在这里

const MainBox = () => {
  const items: MenuItem[] = [
    {
      key: "Request",
      label: "Request",
      disabled: false,
    },
    {
      key: "Compare",
      label: "Compare",
      disabled: false,
    },
  ];

  const { isLoading } = useUser(123);
  return (
    <div>
      <Spin spinning={isLoading} />
      <AppHeader />
      <Layout>
        <Sider style={{ backgroundColor: "white" }} width={500}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>Canyon</div>
            <Space>
              <Button type="primary">New</Button>
              <Button type="primary">Import</Button>
            </Space>
          </div>
          <div style={{ display: "flex" }}>
            <Menu mode="vertical" items={items} />
            <div><Collection></Collection><Environment></Environment></div>
          </div>
        </Sider>
        <Content><div><ComparePage /><RequestPage /></div></Content>
      </Layout>
    </div>
  );
};
export default MainBox;
