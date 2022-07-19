import styled from "@emotion/styled";
import { Button, Card, Divider, Select } from "antd";
import { FC, useEffect } from "react";

import { GitHubStarButton } from "../components";
import ChangeLangButton from "../i18n/ChangeLangButton";
import { useStore } from "../store";

const HeaderWrapper = styled.div`
  height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.span<{ collapsed?: boolean }>`
  line-height: 32px;
  font-weight: bolder;
  margin-left: ${(props) => (props.collapsed ? "22px" : "16px")};
  display: flex;
  align-items: center;
  transition: all 0.2s;
`;

const HeaderMenu = styled.div`
  height: 32px;
  padding-right: 8px;
  .ant-btn {
    top: -2px;
  }
  & > * {
    margin-right: 8px;
  }
`;

const { Option } = Select;

const Header: FC<{ collapsed?: boolean }> = ({ collapsed }) => {
  const workspaces = useStore((state) => state.workspaces);
  const { theme, changeTheme, currentWorkspaceId, setCurrentWorkspaceId } =
    useStore();

  const handleChange = (value: string) => {
    setCurrentWorkspaceId(value);
  };

  useEffect(() => {
    setCurrentWorkspaceId(workspaces[0]?.id);
  }, [workspaces]);

  // 初始化主题
  useEffect(() => {
    localStorage.getItem("theme") !== theme && changeTheme();
  }, []);
  return (
    <Card bordered={false} bodyStyle={{ padding: 0 }} style={{ zIndex: 100 }}>
      <HeaderWrapper>
        <Logo collapsed={collapsed}>
          <span>AREX</span>
          {!collapsed && <GitHubStarButton />}
        </Logo>

        <HeaderMenu>
          <Button
            type="text"
            icon={theme === "light" ? "🌛" : "🌞"}
            onClick={() => changeTheme()}
          />
          <ChangeLangButton />
          <Select
            value={currentWorkspaceId}
            placeholder={"请选择workspace"}
            style={{ width: 160 }}
            onChange={handleChange}
          >
            {workspaces.map((item, index: number) => (
              <Option key={index} value={item.id}>
                {item.workspaceName}
              </Option>
            ))}
          </Select>
        </HeaderMenu>
      </HeaderWrapper>
      <Divider style={{ margin: "0" }} />
    </Card>
  );
};

export default Header;
