import { Avatar, Dropdown, Menu, Space } from "antd";
import AppGitHubStarButton from "./GitHubStarButton";
import { DownOutlined, SettingOutlined } from "@ant-design/icons";
import Setting from "../setting";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
type Props = {
  userinfo: any;
  workspaces: any[];
};
const AppHeader: FC<Props> = ({ userinfo, workspaces }) => {
  const _useNavigate = useNavigate();
  const [isSettingModalVisible, setIsSettingModalVisible] = useState(false);
  return (
    <>
    <div className={"app-header"}>
      <Space className={"left"}>
        <a
          className={"app-name"}
          onClick={() => {
            // useNavigate()('/')
            _useNavigate("/");
          }}
        >
          AREX
        </a>
        <AppGitHubStarButton />
        <Dropdown
          overlay={
            (
              <Menu
                items={workspaces.map((workspace) => {
                  return {
                    key: workspace.id,
                    label: <a onClick={() => {}}>{workspace.workspaceName}</a>,
                  };
                })}
              />
            )
          }
        >
          <span onClick={(e) => e.preventDefault()}>
            <Space>Workspaces<DownOutlined /></Space>
          </span>
        </Dropdown>
      </Space>
      <div className={"right"}>
        <div className="hover-wrap">
          <Dropdown
            overlay={
              (
                <Menu
                  items={["Setting"].map((workspace) => {
                    return {
                      key: workspace,
                      label: (
                        <a
                          onClick={() => {
                            setIsSettingModalVisible(true);
                          }}
                        >
                          {workspace}
                        </a>
                      ),
                    };
                  })}
                />
              )
            }
          >
            <span onClick={(e) => e.preventDefault()}>
              <Space><SettingOutlined style={{ color: "#6B6B6B" }} /></Space>
            </span>
          </Dropdown>
        </div>
        <Avatar
          size={20}
          style={{ marginRight: "8px" }}
        />
      </div>
    </div>
    {/*模态框*/}
    <Setting
      isModalVisible={isSettingModalVisible}
      setModalVisible={setIsSettingModalVisible}
    />
    </>
  );
};

export default AppHeader;
