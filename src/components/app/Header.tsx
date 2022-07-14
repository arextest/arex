import {Avatar, Button, Dropdown, Menu, Space} from "antd";
import AppGitHubStarButton from "./GitHubStarButton";
import {DownOutlined} from "@ant-design/icons";

const menu = (
    <Menu
        items={[
          {
            key: '1',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                  1st menu item
                </a>
            ),
          },
        ]}
    />
);

const AppHeader = ({userinfo}) => {
  return <div className={'app-header'}>
    <Space className={'left'}>
      <a className={'app-name'}>
        AREX
      </a>
      <AppGitHubStarButton/>
      <Dropdown overlay={menu}>
        <a onClick={e => e.preventDefault()}>
          <Space>
            Workspaces
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    </Space>

    <div className={'right'}>
      <Avatar src="https://joeschmoe.io/api/v1/random" size={20} style={{marginRight:'8px'}}/>
    </div>
  </div>;
};

export default AppHeader;
