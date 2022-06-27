import {
  ContainerOutlined,
  DesktopOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import styled from "@emotion/styled";
import { useRequest } from "ahooks";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import React, {useState} from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";

import { FileSystemService } from "../api/FileSystem.service";
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

  const [activeKey,setActiveKey] = useState('normal')

  const onClick: MenuProps["onClick"] = (e) => {
    setActiveKey(e.key)
    to(`/${e.key}`);
  }

  return (
    <MainBoxWrapper>
      <Header />
      <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>
        <Menu
          activeKey={activeKey}
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
