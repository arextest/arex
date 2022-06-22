import styled from "@emotion/styled";
import {Button, Divider, Select} from "antd";
import { useEffect, useState } from "react";

import ChangeLangBotton from "../i18n/ChangeLangBotton";
import { useStore } from "../store";

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
`;

const HeaderMenu = styled.div`
  height: 32px;
  .ant-btn {
    top: -2px;
  }
  & > * {
    margin-right: 16px;
  }
`;

const { Option } = Select;
const Header = () => {
  const [workspaceId, setWorkspaceId] = useState("");
  const workspaces = useStore((state) => state.workspaces);
  const currentWorkspaceId = useStore((state) => state.currentWorkspaceId);
  const setCurrentWorkspaceId = useStore(
    (state) => state.setCurrentWorkspaceId
  );
  const handleChange = (value: string) => {
    setCurrentWorkspaceId(value);
  };

  useEffect(() => {
    setCurrentWorkspaceId(workspaces[0]?.id);
  }, [workspaces]);

  return (
    <>
      <HeaderWrapper>
        <Logo>AREX</Logo>

        <HeaderMenu>
          <ChangeLangBotton />

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
          {/*<Button type={'primary'}>新增workspace</Button>*/}
        </HeaderMenu>
      </HeaderWrapper>

      <Divider style={{ margin: "0" }} />
    </>
  );
};

export default Header;
