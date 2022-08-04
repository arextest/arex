import { DownOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Button, Divider, Dropdown, Menu, Popover, Space } from 'antd';
import React, { FC, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Workspace } from '../../services/WorkspaceService';
import { useStore } from '../../store';
import { Theme, ThemeIcon } from '../../style/theme';
import Setting from '../Setting';
import AddWorkspace from '../workspace/AddWorkspace';
import AppGitHubStarButton from './GitHubStarButton';
import InviteWorkspace from '../workspace/Invite';

type AppHeaderProps = {
  workspaces: Workspace[];
};

const WorkspacesContent: FC<{ workspaces: Workspace[] }> = ({ workspaces }) => {
  const params = useParams();
  const nav = useNavigate();

  return (
    <>
      <AddWorkspace />
      <Menu
        style={{ border: 'none', width: '200px' }}
        onSelect={(val) => {
          console.log(val);
          const key = val.key;
          const label = workspaces.find((i) => i.id === key)?.workspaceName;
          label && (window.location.href = `/${key}/workspace/${label}`);
        }}
        activeKey={params.workspaceId}
        items={workspaces.map((workspace) => {
          return {
            key: workspace.id,
            label: workspace.workspaceName,
          };
        })}
      />
    </>
  );
};

const AppHeader: FC<AppHeaderProps> = ({ workspaces }) => {
  const nav = useNavigate();

  const store = useStore();
  const { theme, changeTheme, userInfo } = useStore();
  const [isSettingModalVisible, setIsSettingModalVisible] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('email');
    store.userInfo = undefined;
    nav('/');
  };
  return (
    <>
      <div className={'app-header'}>
        <Space className={'left'}>
          <span className={'app-name'}>AREX</span>
          <AppGitHubStarButton />
          {/*workspace*/}
          <Popover
            content={<WorkspacesContent workspaces={workspaces} />}
            title={false}
            trigger='click'
          >
            <Space style={{ cursor: 'pointer' }}>
              Workspaces
              <DownOutlined />
            </Space>
          </Popover>
        </Space>

        <div className={'right'}>
          <InviteWorkspace />
          <Button
            type='text'
            icon={theme === Theme.light ? ThemeIcon.dark : ThemeIcon.light}
            onClick={() => changeTheme()}
          />
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu
                items={['Setting'].map((workspace) => {
                  return {
                    key: workspace,
                    label: (
                      <span
                        onClick={() => {
                          setIsSettingModalVisible(true);
                        }}
                      >
                        {workspace}
                      </span>
                    ),
                  };
                })}
              />
            }
          >
            <Button
              type='text'
              icon={<SettingOutlined />}
              onClick={(e) => e.preventDefault()}
              style={{ color: '#6B6B6B' }}
            />
          </Dropdown>

          <Dropdown
            trigger={['click']}
            overlay={
              <Menu
                items={[
                  {
                    key: 'Sign Out',
                    label: <span onClick={handleLogout}>Sign Out</span>,
                  },
                ]}
              />
            }
          >
            <Avatar
              size={20}
              src={'https://joeschmoe.io/api/v1/random'}
              style={{ marginLeft: '8px' }}
            >
              {userInfo?.email}
            </Avatar>
          </Dropdown>
        </div>
      </div>

      <Divider style={{ margin: '0' }} />

      {/*模态框*/}
      <Setting isModalVisible={isSettingModalVisible} setModalVisible={setIsSettingModalVisible} />
    </>
  );
};

export default AppHeader;
