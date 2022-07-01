import {
  ContainerOutlined,
  DesktopOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { css } from "@emotion/react";
import { useRequest } from "ahooks";
import { Layout, Menu, MenuProps } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";

import { FileSystemService } from "../api/FileSystem.service";
import { useStore } from "../store";
import { Theme } from "../style/theme";
import Header from "./Header";

const { Content, Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

const MainBox: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const theme = useStore((state) => state.theme);
  const to = useNavigate();
  const { t } = useTranslation("layout");
  const items: MenuItem[] = [
    { key: "normal", label: t("sideMenu.normal"), icon: <PieChartOutlined /> },
    {
      key: "compare",
      label: t("sideMenu.compare"),
      icon: <DesktopOutlined />,
      disabled: false,
    },
    {
      key: "replay",
      label: t("sideMenu.replay"),
      icon: <ContainerOutlined />,
      disabled: false,
    },
    {
      key: "setting",
      label: "API",
      icon: <ContainerOutlined />,
      disabled: true,
    },
  ];

  const setWorkspaces = useStore((state) => state.setWorkspaces);
  useRequest(() => FileSystemService.queryWorkspacesByUser({}), {
    onSuccess: (res) => setWorkspaces(res.body.workspaces),
  });

  const [activeKey, setActiveKey] = useState("normal");

  const onClick: MenuProps["onClick"] = (e) => {
    setActiveKey(e.key);
    to(`/${e.key}`);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header collapsed={collapsed} />

      <Layout>
        <Sider
          collapsible
          width={150}
          theme={theme}
          collapsed={collapsed}
          onCollapse={setCollapsed}
          css={css`
            border-right: 1px solid rgba(0, 0, 0, 0.06) !important;
            .ant-menu-root,
            .ant-layout-sider-trigger {
              background: inherit !important;
              border-right: inherit !important;
            }
          `}
        >
          <Menu
            activeKey={activeKey}
            onClick={onClick}
            mode="vertical"
            items={items}
            theme={theme}
          />
        </Sider>

        <Content
          style={{
            padding: "0 16px",
            backgroundColor: theme === Theme.light ? "#fff" : "#202020",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainBox;
