import {Avatar, Button, Dropdown, Menu, Space} from "antd";
import AppGitHubStarButton from "./GitHubStarButton";
import {DownOutlined, SettingOutlined} from "@ant-design/icons";

// const menu = (
//
// );

const AppHeader = ({userinfo,workspaces}) => {
  return <div className={'app-header'}>
    <Space className={'left'}>
      <a className={'app-name'}>
        AREX
      </a>
      <AppGitHubStarButton/>
      <Dropdown overlay={    <Menu
          items={workspaces.map(workspace=>{
              return {
                  key: workspace.id,
                  label: (
                      <a onClick={()=>{
                      }}>
                          {workspace.workspaceName}
                      </a>
                  ),
              }
          })}
      />}>
        <span onClick={e => e.preventDefault()}>
          <Space>
            Workspaces
            <DownOutlined />
          </Space>
        </span>
      </Dropdown>
    </Space>

    <div className={'right'}>
        <div className="hover-wrap">
            <SettingOutlined style={{color:'#6B6B6B'}}/>
        </div>

      <Avatar src="https://joeschmoe.io/api/v1/random" size={20} style={{marginRight:'8px'}}/>
    </div>
  </div>;
};

export default AppHeader;
