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
