import { DownOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Menu, Popover, Space } from 'antd';
import { FC, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
const { Item } = Menu;

import { useStore } from '../../store';
import { Theme, ThemeIcon } from '../../style/theme';
import Setting from '../Setting';
import GitHubStarButton from './GitHubStarButton';
type Props = {
  userinfo: any;
  workspaces: any[];
};
const WorkspacesContent = ({ workspaces }) => {
  const _useParams = useParams();

  return (
    <div>
      <Button>创建</Button>
      <p>All workspaces</p>
      <div>
        <Menu
          onSelect={(val) => {
            console.log(val);
            const key = val.key;
            const label = workspaces.find((i) => i.id === key).workspaceName;
            window.location.href = `/${key}/workspace/${label}`;
          }}
          activeKey={_useParams.workspaceId}
          items={workspaces.map((workspace) => {
            return {
              key: workspace.id,
              label: workspace.workspaceName,
            };
          })}
        />
      </div>
    </div>
  );
};
const AppHeader: FC<Props> = ({ userinfo, workspaces }) => {
  const _useNavigate = useNavigate();
  const { theme, changeTheme } = useStore();
  const [isSettingModalVisible, setIsSettingModalVisible] = useState(false);
  return (
    <>
      <div className={'app-header'}>
        <Space className={'left'}>
          <span className={'app-name'}>AREX</span>
          <GitHubStarButton />
          <Dropdown
            overlay={
              <Menu
                items={workspaces.map((workspace) => {
                  return {
                    key: workspace.id,
                    label: (
                      <a
                        onClick={() => {
                          window.location.href = `/${workspace.id}/workspace/${workspace.workspaceName}`;
                        }}
                      >
                        {workspace.workspaceName}
                      </a>
                    ),
                  };
                })}
              />
            }
          >
            <span onClick={(e) => e.preventDefault()}>
              <Space>
                Workspaces
                <DownOutlined />
              </Space>
            </span>
          </Dropdown>
          {/*workspace*/}
          <Popover
            content={<WorkspacesContent workspaces={workspaces}></WorkspacesContent>}
            title={false}
            trigger='click'
          >
            <Button>Click me</Button>
          </Popover>
        </Space>

        <div className={'right'}>
          <Button
            type='text'
            icon={theme === Theme.light ? ThemeIcon.dark : ThemeIcon.light}
            onClick={() => changeTheme()}
          />

          <div className='hover-wrap'>
            <Dropdown
              trigger={['click']}
              overlay={
                <Menu
                  items={['Setting'].map((workspace) => {
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
              }
            >
              <span onClick={(e) => e.preventDefault()}>
                <Space>
                  <SettingOutlined style={{ color: '#6B6B6B' }} />
                </Space>
              </span>
            </Dropdown>
          </div>
          <div className={'hover-wrap'}>
            <Dropdown
              trigger={['click']}
              overlay={
                <Menu
                  items={[
                    {
                      key: 'Sign Out',
                      label: (
                        <a
                          onClick={() => {
                            localStorage.removeItem('email');
                            // value.dispatch({ type: "login"})
                            // _useNavigate('/')
                            window.location.href = '/';
                          }}
                        >
                          Sign Out
                        </a>
                      ),
                    },
                  ]}
                />
              }
            >
              <span onClick={(e) => e.preventDefault()}>
                <Space>
                  <Avatar size={20}>{userinfo.email[0]}</Avatar>
                </Space>
              </span>
            </Dropdown>
          </div>
        </div>
      </div>
      {/*模态框*/}
      <Setting isModalVisible={isSettingModalVisible} setModalVisible={setIsSettingModalVisible} />
    </>
  );
};

export default AppHeader;
