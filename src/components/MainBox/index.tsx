import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Header from "../Header";
import {useMount} from "ahooks";
import {FileSystemService} from "../../api/FileSystemService";
import { useStore } from './../../store'

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("常规", "normal", <PieChartOutlined />),
  getItem("对比", "compare", <DesktopOutlined />),
  getItem("回放", "replay", <ContainerOutlined />),
  getItem("API", "setting", <ContainerOutlined />),
];

const MainBox: React.FC = () => {
  const s = useNavigate();
  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click", e);
    // useNavigate().push(e.key);

    s(`/${e.key}`);
  };

  const setWorkspaces = useStore((state) => state.setWorkspaces)

  useMount(()=>{
    init()
  })
  function init() {
    FileSystemService.queryWorkspacesByUser({}).then(res=>{
      setWorkspaces(res.body.workspaces)
    })
  }
  return (
    <div>
      <Header />
      <div style={{ display: "flex", minHeight: "calc(100% - 56px)" }}>
        <Menu
          onClick={onClick}
          style={{ width: 150 }}
          mode="vertical"
          items={items}
        />
        <div
          style={{ flex: "1", padding: "14px", width: "calc(100vw - 150px)" }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainBox;
