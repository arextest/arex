import styled from "@emotion/styled";
import { Button, Divider, Select } from "antd";
import { useEffect, useState } from "react";

import ChangeLangButton from "../i18n/ChangeLangButton";
import { useStore } from "../store";
import AppGitHubStarButton from "./GitHubStarButton";

const HeaderWrapper = styled.div`
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.span`
  line-height: 32px;
  font-weight: bolder;
  margin-left: 16px;
  display: flex;
  align-items: center;
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
const Header = () => {
  const [workspaceId, setWorkspaceId] = useState("");
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
    <>
      <HeaderWrapper>
        <Logo>
          <span style={{marginRight:"8px"}}>AREX</span>
          <AppGitHubStarButton></AppGitHubStarButton>
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
            {workspaces.map((i, index) => {
              return (
                <Option key={index} value={i.id}>
                  {i.workspaceName}
                </Option>
              );
            })}
          </Select>
        </HeaderMenu>
      </HeaderWrapper>
      <Divider style={{ margin: "0" }} />
    </>
  );
};

export default Header;
