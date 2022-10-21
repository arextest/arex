import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  GlobalOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { Input, message, Select, Tooltip } from 'antd';
import React, { FC, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { RoleEnum } from '../../constant';
import { generateGlobalPaneId } from '../../helpers/utils';
import { MenuTypeEnum } from '../../menus';
import { PageTypeEnum } from '../../pages';
import EnvironmentService from '../../services/Environment.service';
import WorkspaceService from '../../services/Workspace.service';
import { useStore } from '../../store';
import { TooltipButton } from '../index';

const WorkspacesMenuWrapper = styled.div<{ width?: string }>`
  height: 35px;
  width: ${(props) => props.width};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 16px;
  border-bottom: 1px solid ${(props) => props.theme.color.border.primary};
  overflow: hidden;
  & > div {
    :first-of-type {
      width: 100%;
    }
    display: flex;
    align-items: center;
  }
`;

const WorkspacesMenu: FC<{ collapse?: boolean }> = (props) => {
  const params = useParams();
  const nav = useNavigate();
  const { userInfo, workspaces, setWorkspaces, setPages, setEnvironmentTreeData, resetPanes } =
    useStore();
  const [editMode, setEditMode] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [status, setStatus] = useState<'' | 'error'>('');

  const { run: getWorkspaces } = useRequest(
    (to?: { workspaceId: string; workspaceName: string }) =>
      WorkspaceService.listWorkspace({ userName: userInfo!.email as string }),
    {
      ready: !!userInfo?.email,
      onSuccess(data, _params) {
        setWorkspaces(data);
        if (_params.length) {
          reset();
          resetPanes();
          nav(`/${_params[0]!.workspaceId}/workspace/${_params[0]!.workspaceName}`);
        } else if (!params.workspaceId || !params.workspaceName) {
          nav(`/${data[0].id}/workspace/${data[0].workspaceName}/workspaceOverview/${data[0].id}`);
        }
      },
    },
  );

  // TODO 需要应用载入时就获取环境变量，此处与envPage初始化有重复代码
  useRequest(
    () => EnvironmentService.getEnvironment({ workspaceId: params.workspaceId as string }),
    {
      ready: !!params.workspaceId,
      refreshDeps: [params.workspaceId],
      onSuccess(res) {
        setEnvironmentTreeData(res);
      },
    },
  );

  const handleAddWorkspace = () => {
    if (newWorkspaceName === '') {
      setStatus('error');
      message.error('Please input the name of workspace!');
    } else {
      createWorkspace({
        userName: userInfo!.email as string,
        workspaceName: newWorkspaceName,
      });
    }
  };

  const handleEditWorkspace = () => {
    params.workspaceName &&
      params.workspaceId &&
      setPages(
        {
          title: params.workspaceName,
          menuType: MenuTypeEnum.Collection,
          pageType: PageTypeEnum.WorkspaceOverview,
          isNew: true,
          paneId: generateGlobalPaneId(
            MenuTypeEnum.Collection,
            PageTypeEnum.WorkspaceOverview,
            params.workspaceId,
          ),
          rawId: params.workspaceId,
        },
        'push',
      );
  };

  const { run: createWorkspace } = useRequest(WorkspaceService.createWorkspace, {
    manual: true,
    onSuccess: (res, params) => {
      if (res.success) {
        const workspaceId = res.workspaceId;
        getWorkspaces({ workspaceId, workspaceName: params[0].workspaceName });
      }
    },
  });

  const handleChangeWorkspace = (workspaceId: string) => {
    const label = workspaces.find((i) => i.id === workspaceId)?.workspaceName;
    if (label) {
      resetPanes();
      nav(`/${workspaceId}/workspace/${label}`);
    }
  };

  const reset = () => {
    setEditMode(false);
    setStatus('');
    setNewWorkspaceName('');
  };

  return (
    <WorkspacesMenuWrapper width={props.collapse ? '100%' : 'calc(100% + 10px)'}>
      <Tooltip
        title={`Workspace${props.collapse ? ': ' + params.workspaceName : ''}`}
        placement='right'
      >
        <GlobalOutlined
          style={{ marginLeft: props.collapse ? '12px' : '0', transition: 'all 0.2s' }}
        />
      </Tooltip>
      {!props.collapse && (
        <>
          <div>
            {editMode ? (
              <Input
                size='small'
                value={newWorkspaceName}
                status={status}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                style={{ marginLeft: '10px', width: '80%' }}
              />
            ) : (
              <Select
                size='small'
                bordered={false}
                value={params.workspaceId}
                options={workspaces.map((ws) => ({
                  value: ws.id,
                  label: (
                    <div>
                      {ws.workspaceName}
                      <span
                        css={css`
                          color: #bdbdbd;
                          margin-left: 4px;
                        `}
                      >
                        (
                        {
                          {
                            [RoleEnum.Admin]: 'Admin',
                            [RoleEnum.Editor]: 'Editor',
                            [RoleEnum.Viewer]: 'Viewer',
                          }[ws.role]
                        }
                        )
                      </span>
                    </div>
                  ),
                }))}
                onChange={handleChangeWorkspace}
                style={{ width: '80%' }}
              />
            )}
          </div>

          <div>
            {editMode ? (
              <>
                <TooltipButton icon={<CheckOutlined />} title='OK' onClick={handleAddWorkspace} />
                <TooltipButton icon={<CloseOutlined />} title='Cancel' onClick={reset} />
              </>
            ) : (
              <TooltipButton
                icon={<PlusOutlined />}
                title='Add Workspace'
                onClick={() => setEditMode(true)}
              />
            )}

            <TooltipButton
              icon={<EditOutlined />}
              title='Edit Workspace'
              onClick={handleEditWorkspace}
            />
            <TooltipButton icon={<UploadOutlined />} title='Import' />
          </div>
        </>
      )}
    </WorkspacesMenuWrapper>
  );
};

export default WorkspacesMenu;
