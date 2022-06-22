import {
  ContainerOutlined,
  DesktopOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import styled from "@emotion/styled";
import { useRequest } from "ahooks";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";

import { FileSystemService } from "../api/FileSystemService";
import { useStore } from "../store";
import Header from "./Header";

type MenuItem = Required<MenuProps>["items"][number];

const MainBoxWrapper = styled.div`
  .bottom {
    position: fixed;
    bottom: 0;
    width: 100%;
    border-top: solid 1px var(--adm-color-border);
    background-color: white;
  }
`;

const MainBox: React.FC = () => {
  const to = useNavigate();
  const { t } = useTranslation("layout");
  const items: MenuItem[] = [
    { key: "normal", label: t("sideMenu.normal"), icon: <PieChartOutlined /> },
    { key: "compare", label: t("sideMenu.compare"), icon: <DesktopOutlined /> },
    {
      key: "replay",
      label: t("sideMenu.replay"),
      icon: <ContainerOutlined />,
      disabled: true,
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

  const onClick: MenuProps["onClick"] = (e) => to(`/${e.key}`);

  return (
    <MainBoxWrapper>
      <Header />
      <div style={{ display: "flex", minHeight: "calc(100% - 56px)" }}>
        <Menu
          activeKey="normal"
          onClick={onClick}
          style={{ width: 150 }}
          mode="vertical"
          items={items}
        />
        <div
          style={{ flex: "1", padding: "0 14px", width: "calc(100vw - 150px)" }}
        >
          <Outlet />
        </div>
      </div>
    </MainBoxWrapper>
  );
};

export default MainBox;
