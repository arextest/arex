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
import { App, Button, Input, Modal, Select, Upload } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { EmailKey, RoleEnum, RoleMap, WorkspaceKey } from '../../constant';
import { getLocalStorage } from '../../helpers/utils';
import { useCustomNavigate } from '../../router/useCustomNavigate';
import { FileSystemService } from '../../services/FileSystem.service';
import WorkspaceService from '../../services/Workspace.service';
import { useStore } from '../../store';
import { TooltipButton } from '../index';
import { PagesType } from '../panes';

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
  const { message } = App.useApp();
  const { t } = useTranslation(['components', 'common']);

  const params = useParams();
  const nav = useNavigate();
  const customNavigate = useCustomNavigate();
  const {
    workspaces,
    setWorkspaces,
    activeWorkspaceId,
    setActiveWorkspaceId,
    invitedWorkspaceId,
    workspacesLastManualUpdateTimestamp,
    setInvitedWorkspaceId,
    resetPage,
  } = useStore();

  const email = getLocalStorage<string>(EmailKey);

  const [editMode, setEditMode] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [status, setStatus] = useState<'' | 'error'>('');
  const [importView, setImportView] = useState(false);
  const [importType, setImportType] = useState('');
  const [importFile, setImportFile] = useState<string>();

  const { run: getWorkspaces } = useRequest(
    (_workspaceId?: string) => WorkspaceService.listWorkspace({ userName: email as string }),
    {
      ready: !!email,
      onSuccess(data, _params) {
        if (!data.length) {
          return createWorkspace({
            userName: email as string,
            workspaceName: 'Default',
          });
        }

        setWorkspaces(data);

        let targetWorkspace = data[0];

        const workspaceIdLS = getLocalStorage<string>(WorkspaceKey);
        const targetWorkspaceId =
          _params[0] || activeWorkspaceId || invitedWorkspaceId || workspaceIdLS;
        if (targetWorkspaceId) {
          const workspace = data.find((workspace) => workspace.id === targetWorkspaceId);
          workspace
            ? (targetWorkspace = workspace)
            : message.warning(t('workSpace.noPermissionOrInvalid'));
          invitedWorkspaceId && setInvitedWorkspaceId('');
        }
        if (targetWorkspace.id && !params.workspaceId) {
          nav(`/${targetWorkspace.id}/workspaceOverview/${targetWorkspace.id}`);
          setActiveWorkspaceId(targetWorkspace.id);
        }
      },
    },
  );

  /**
   * 作用不同与 refreshDeps:
   * refreshDeps 等效手动触发 refresh
   * 而 refresh 会使用上一次的 params，重新调用 run
   * 导致 params 混乱
   */
  useEffect(() => {
    getWorkspaces();
  }, [workspacesLastManualUpdateTimestamp]);

  const handleAddWorkspace = () => {
    if (newWorkspaceName === '') {
      setStatus('error');
      message.error(t('workSpace.emptySpaceName'));
    } else {
      createWorkspace({
        userName: email as string,
        workspaceName: newWorkspaceName,
      });
    }
  };

  const handleEditWorkspace = () => {
    params.workspaceId &&
      customNavigate(`/${params.workspaceId}/${PagesType.WorkspaceOverview}/${params.workspaceId}`);
  };

  const { run: createWorkspace } = useRequest(WorkspaceService.createWorkspace, {
    manual: true,
    onSuccess: (res) => {
      if (res.success) {
        message.success(t('workSpace.createSuccess'));
        reset();
        resetPage();
        getWorkspaces(res.workspaceId);
      }
    },
  });

  const handleChangeWorkspace = (workspaceId: string) => {
    const label = workspaces.find((i) => i.id === workspaceId)?.workspaceName;
    if (label) {
      resetPage();
      setActiveWorkspaceId(workspaceId);
      nav(`/${workspaceId}/${label}/WorkspaceOverviewPage/${workspaceId}`);
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
        if (res.body && res.body.success) {
          message.success(t('workSpace.importSuccess'));
          setImportView(false);
          setImportType('');
          setImportFile(undefined);
        } else {
          message.error(t('workSpace.importFailed'));
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
          title={`${t('workSpace.workSpace')}${props.collapse ? ': ' + params.workspaceName : ''}`}
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
                  <TooltipButton
                    icon={<CheckOutlined />}
                    title={t('save', { ns: 'common' })}
                    onClick={handleAddWorkspace}
                  />
                  <TooltipButton
                    icon={<CloseOutlined />}
                    title={t('cancel', { ns: 'common' })}
                    onClick={reset}
                  />
                </>
              ) : (
                <>
                  <TooltipButton
                    icon={<PlusOutlined />}
                    title={t('workSpace.add')}
                    onClick={() => setEditMode(true)}
                  />
                  <TooltipButton
                    icon={<EditOutlined />}
                    title={t('workSpace.edit')}
                    onClick={handleEditWorkspace}
                  />
                </>
              )}

              <TooltipButton
                icon={<UploadOutlined />}
                title={t('workSpace.import')}
                onClick={viewImport}
              />
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
                  {t('workSpace.collections')}
                </div>
              }
            >
              {importType != '' ? (
                <div>
                  <span>
                    {t('workSpace.import')} {importType}
                  </span>
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
                    <Button icon={<UploadOutlined />}>{t('workSpace.selectFile')}</Button>
                  </Upload>
                  <Button
                    type='primary'
                    disabled={!importFile}
                    style={{ width: '100%', marginTop: 15 }}
                    onClick={handleImport}
                  >
                    {t('workSpace.import')}
                  </Button>
                </div>
              ) : (
                <div>
                  <Button type='text' onClick={() => setImportType('collection')}>
                    {t('workSpace.importCollection')}
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
