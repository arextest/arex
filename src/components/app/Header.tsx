import { DownOutlined, SettingOutlined } from '@ant-design/icons';
import { useMount, useRequest } from 'ahooks';
import { Avatar, Button, Divider, Dropdown, Menu, Popover, Space } from 'antd';
import React, { FC, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { WorkspaceService } from '../../services/Workspace.service';
import { useStore } from '../../store';
import { Theme, ThemeIcon } from '../../style/theme';
import Setting from '../Setting';
import AddWorkspace from '../workspace/AddWorkspace';
import InviteWorkspace from '../workspace/Invite';
import AppGitHubStarButton from './GitHubStarButton';

const AppHeader = () => {
  const nav = useNavigate();
  const params = useParams();
  // const params = useParams();
  const workspaces = useStore((state) => state.workspaces);
  const setWorkspaces = useStore((state) => state.setWorkspaces);

  const store = useStore();
  const { theme, changeTheme, userInfo } = useStore();
  const [isSettingModalVisible, setIsSettingModalVisible] = useState(false);

  const { run } = useRequest(
    () => WorkspaceService.listWorkspace({ userName: localStorage.getItem('email') }),
    {
      manual: true,
      onSuccess(data) {
        setWorkspaces(data);
        if (params.workspaceId && params.workspaceName) {
        } else {
          nav(`/${data[0].id}/workspace/${data[0].workspaceName}/workspaceOverview/${data[0].id}`);
        }
      },
    },
  );
  const WorkspacesContent = () => {
    return (
      <>
        <AddWorkspace />
        <Menu
          style={{ border: 'none', width: '200px' }}
          onSelect={(val) => {
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

  // 在AppHeader内执行应用必要的初始化函数
  useMount(() => {
    // 1.获取workspaces
    run();
  });

  const handleLogout = () => {
    localStorage.clear();
    store.userInfo = undefined;
    window.location.href = '/login';
  };
  return (
    <>
      <div className={'app-header'}>
        <Space className={'left'}>
          <span className={'app-name'}>AREX</span>
          <AppGitHubStarButton />
          {/*workspace*/}
          <Popover content={<WorkspacesContent />} title={false} trigger='click'>
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
            overlayStyle={{ width: '170px' }}
            trigger={['click']}
            overlay={
              <Menu
                onClick={(e) => {
                  console.log(e);
                  if (e.key === 'settings') {
                    setIsSettingModalVisible(true);
                  }
                }}
                items={[
                  {
                    key: 'settings',
                    label: <span>Settings</span>,
                  },
                  {
                    type: 'divider',
                  },
                  {
                    key: '1',
                    label: <span>Privacy Policy</span>,
                    disabled: true,
                  },
                  {
                    key: '2',
                    label: <span>Terms</span>,
                    disabled: true,
                  },
                ]}
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
            overlayStyle={{ width: '170px' }}
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
            <Avatar size={20} style={{ marginLeft: '8px', cursor: 'pointer' }}>
              {userInfo?.email}
            </Avatar>
          </Dropdown>
        </div>
      </div>

      <Divider style={{ margin: '0' }} />

      {/*模态框*/}
      <Setting
        isModalVisible={isSettingModalVisible}
        onClose={() => {
          setIsSettingModalVisible(false);
        }}
      />
    </>
  );
};

export default AppHeader;
