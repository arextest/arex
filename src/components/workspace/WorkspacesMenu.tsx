import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  GlobalOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { ArrowLeftOutlined } from '@ant-design/icons/lib';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { Button, Input, message, Modal, Select, Upload } from 'antd';
import React, { FC, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { EmailKey, RoleEnum, RoleMap, WorkspaceKey } from '../../constant';
import { generateGlobalPaneId, getLocalStorage, setLocalStorage } from '../../helpers/utils';
import { MenusType } from '../../menus';
import { PagesType } from '../../pages';
import { FileSystemService } from '../../services/FileSystem.service';
import WorkspaceService from '../../services/Workspace.service';
import { useStore } from '../../store';
import { TooltipButton } from '../index';

const Role = styled((props: { className?: string; role: RoleEnum }) => (
  <span className={props.className}>({RoleMap[props.role]})</span>
))`
  margin-left: 4px;
  color: ${(props) => props.theme.colorTextTertiary};
`;

const WorkspacesMenuWrapper = styled.div<{ collapse?: boolean }>`
  height: 35px;
  width: ${(props) => (props.collapse ? '100%' : 'calc(100% + 10px)')};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 16px;
  overflow: hidden;
  color: ${(props) => props.theme.colorText};
  border-bottom: 1px solid ${(props) => props.theme.colorBorder};
`;

const WorkspacesMenu: FC<{ collapse?: boolean }> = (props) => {
  const params = useParams();
  const nav = useNavigate();
  const {
    workspaces,
    setWorkspaces,
    setActiveWorkspaceId,
    invitedWorkspaceId,
    workspacesLastManualUpdateTimestamp,
    setInvitedWorkspaceId,
    setPages,
    resetPanes,
  } = useStore();

  const email = getLocalStorage<string>(EmailKey);

  const [editMode, setEditMode] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [status, setStatus] = useState<'' | 'error'>('');
  const [importView, setImportView] = useState(false);
  const [allImportItem, setAllImportItem] = useState(false);
  const [importType, setImportType] = useState('');
  const [importFile, setImportFile] = useState<string>();

  const { run: getWorkspaces } = useRequest(
    (workspaceId?: string) => WorkspaceService.listWorkspace({ userName: email as string }),
    {
      ready: !!email,
      refreshDeps: [workspacesLastManualUpdateTimestamp],
      onSuccess(data, _params) {
        if (!data.length) {
          return createWorkspace({
            userName: email as string,
            workspaceName: 'Default',
          });
        }

        setWorkspaces(data);

        let targetWorkspace = data[0];

        const workspaceIdUrl = params.workspaceId;
        const workspaceIdLS = getLocalStorage<string>(WorkspaceKey);
        const targetWorkspaceId =
          _params[0] || workspaceIdUrl || invitedWorkspaceId || workspaceIdLS;

        if (targetWorkspaceId) {
          const workspace = data.find((workspace) => workspace.id === targetWorkspaceId);
          workspace ? (targetWorkspace = workspace) : message.warning('无目标工作目录权限');
          invitedWorkspaceId && setInvitedWorkspaceId('');
        }
        if (targetWorkspace.id) {
          nav(
            `/${targetWorkspace.id}/workspace/${targetWorkspace.workspaceName}/workspaceOverview/${targetWorkspace.id}`,
          );
          setActiveWorkspaceId(targetWorkspace.id);
        }
      },
    },
  );

  const handleAddWorkspace = () => {
    if (newWorkspaceName === '') {
      setStatus('error');
      message.error('Please input the name of workspace!');
    } else {
      createWorkspace({
        userName: email as string,
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
          menuType: MenusType.Collection,
          pageType: PagesType.WorkspaceOverview,
          isNew: true,
          data: undefined,
          paneId: generateGlobalPaneId(
            MenusType.Collection,
            PagesType.WorkspaceOverview,
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
        message.success('create workspace successfully');
        reset();
        resetPanes();
        getWorkspaces(res.workspaceId);
      }
    },
  });

  const handleChangeWorkspace = (workspaceId: string) => {
    const label = workspaces.find((i) => i.id === workspaceId)?.workspaceName;
    if (label) {
      resetPanes();
      setActiveWorkspaceId(workspaceId);
      nav(`/${workspaceId}/workspace/${label}/WorkspaceOverviewPage/${workspaceId}`);
    }
  };

  const reset = () => {
    setEditMode(false);
    setStatus('');
    setNewWorkspaceName('');
  };

  const viewImport = () => {
    params.workspaceName && params.workspaceId && setImportView(true);
  };

  const handleImport = () => {
    if (params.workspaceName && params.workspaceId && importFile) {
      const param = {
        workspaceId: params.workspaceId,
        path: [],
        type: 1,
        importString: importFile,
      };
      FileSystemService.importFile(param).then((res) => {
        console.log(res);
        if (res.body && res.body.success) {
          message.success('Import success!');
          setImportView(false);
          setImportType('');
          setImportFile(undefined);
        } else {
          message.error('Import fail!');
        }
        return;
      });
    }
  };

  return (
    <WorkspacesMenuWrapper collapse={props.collapse}>
      <>
        <TooltipButton
          icon={<GlobalOutlined />}
          title={`Workspace${props.collapse ? ': ' + params.workspaceName : ''}`}
          placement='right'
          style={{
            marginLeft: props.collapse ? '8px' : '0',
            transition: 'all 0.2s',
          }}
        />

        {!props.collapse &&
          (editMode ? (
            <Input
              size='small'
              value={newWorkspaceName}
              status={status}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              style={{ width: '75%', margin: '0 8px' }}
            />
          ) : (
            <Select
              size='small'
              bordered={false}
              value={params.workspaceId}
              options={workspaces.map((ws) => ({
                value: ws.id,
                label: (
                  <>
                    {ws.workspaceName} <Role role={ws.role} />
                  </>
                ),
              }))}
              onChange={handleChangeWorkspace}
              style={{ width: '80%' }}
            />
          ))}
      </>

      <>
        {!props.collapse && (
          <>
            <div style={{ display: 'flex' }}>
              {editMode ? (
                <>
                  <TooltipButton icon={<CheckOutlined />} title='OK' onClick={handleAddWorkspace} />
                  <TooltipButton icon={<CloseOutlined />} title='Cancel' onClick={reset} />
                </>
              ) : (
                <>
                  <TooltipButton
                    icon={<PlusOutlined />}
                    title='Add Workspace'
                    onClick={() => setEditMode(true)}
                  />
                  <TooltipButton
                    icon={<EditOutlined />}
                    title='Edit Workspace'
                    onClick={handleEditWorkspace}
                  />
                </>
              )}

              <TooltipButton icon={<UploadOutlined />} title='Import' onClick={viewImport} />
            </div>

            <Modal
              open={importView}
              onCancel={() => setImportView(false)}
              footer={false}
              width={300}
              title={
                <div>
                  {importType != '' ? (
                    <span style={{ marginRight: 20, float: 'left' }}>
                      <ArrowLeftOutlined onClick={() => setImportType('')} />
                    </span>
                  ) : null}
                  Collections
                </div>
              }
            >
              {importType != '' ? (
                <div>
                  <span>Import {importType}</span>
                  <Upload
                    maxCount={1}
                    onRemove={() => setImportFile(undefined)}
                    beforeUpload={(file) => {
                      const reader = new FileReader();
                      reader.readAsText(file);
                      reader.onload = (e) => {
                        const content = e.target?.result && JSON.stringify(e.target.result);
                        content && setImportFile(content);
                      };
                      return false;
                    }}
                  >
                    <Button icon={<UploadOutlined />}>Select File</Button>
                  </Upload>
                  <Button
                    type='primary'
                    disabled={!importFile}
                    style={{ width: '100%', marginTop: 15 }}
                    onClick={handleImport}
                  >
                    Import
                  </Button>
                </div>
              ) : (
                <div>
                  <Button type='text' onClick={() => setImportType('collection')}>
                    Import collection
                  </Button>
                  <br />
                  {/*<Button type='text' onClick={() => setImportType('case')}>*/}
                  {/*  Import cases*/}
                  {/*</Button>*/}
                  <br />
                  {/*<Button*/}
                  {/*  shape='round'*/}
                  {/*  icon={allImportItem ? <UpOutlined /> : <DownOutlined />}*/}
                  {/*  size='small'*/}
                  {/*  style={{ color: 'white', marginTop: 5, marginLeft: 16 }}*/}
                  {/*  onClick={() => setAllImportItem(!allImportItem)}*/}
                  {/*>*/}
                  {/*  {allImportItem ? 'less' : 'more'}*/}
                  {/*</Button>*/}
                </div>
              )}
            </Modal>
          </>
        )}
      </>
    </WorkspacesMenuWrapper>
  );
};

export default WorkspacesMenu;
