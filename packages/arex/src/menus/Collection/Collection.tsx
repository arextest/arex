import { PlayCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ArexMenuFC,
  getLocalStorage,
  styled,
  TooltipButton,
  useTranslation,
} from '@arextest/arex-core';
import { useRequest, useSize } from 'ahooks';
import { App } from 'antd';
import React, { useMemo, useRef } from 'react';

import { CollectionSelect, Icon, WorkspacesMenu } from '@/components';
import { CollectionSelectProps } from '@/components/CollectionSelect';
import { CollectionNodeType, EMAIL_KEY, PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import CollectionsImportExport, {
  CollectionsImportExportRef,
} from '@/menus/Collection/ImportExport';
import { FileSystemService } from '@/services';
import { useCollections, useMenusPanes, useWorkspaces } from '@/store';
import { CaseSourceType } from '@/store/useCollections';

const Collection: ArexMenuFC = (props) => {
  const { t } = useTranslation(['components']);
  const { message } = App.useApp();
  const navPane = useNavPane();
  const size = useSize(() => document.getElementById('arex-menu-wrapper'));

  const userName = getLocalStorage<string>(EMAIL_KEY) as string;

  const { reset: resetPane } = useMenusPanes();
  const { activeWorkspaceId, workspaces, getWorkspaces, changeActiveWorkspaceId } = useWorkspaces();
  const { createRootCollectionNode, setExpandedKeys } = useCollections();

  const collectionsImportExportRef = useRef<CollectionsImportExportRef>(null);

  const workspacesOptions = useMemo(
    () =>
      workspaces.map((workspace) => ({
        value: workspace.id,
        label: workspace.workspaceName,
      })),
    [workspaces],
  );

  const { run: createCollection } = useRequest(
    () =>
      FileSystemService.addCollectionItem({
        id: activeWorkspaceId,
        userName,
      }),
    {
      manual: true,
      onSuccess(res) {
        if (res.success) {
          createRootCollectionNode(res.infoId);
        }
      },
    },
  );

  const { run: createWorkspace } = useRequest(FileSystemService.createWorkspace, {
    manual: true,
    onSuccess: (res) => {
      if (res.success) {
        message.success(t('workSpace.createSuccess'));
        resetPane();
        getWorkspaces(res.workspaceId);
      }
    },
  });

  // requestId structure: workspaceId-nodeTypeStr-id
  const [workspaceId, nodeTypeStr, value] = useMemo(
    () => props.value?.split('-') || [],
    [props.value],
  );
  const selectedKeys = useMemo(() => {
    return value ? [value] : undefined;
  }, [value]);

  const handleSelect: CollectionSelectProps['onSelect'] = (keys, node) => {
    if (node.nodeType !== CollectionNodeType.folder) {
      const icon =
        node.nodeType === CollectionNodeType.interface
          ? node.method || undefined
          : node.nodeType === CollectionNodeType.case
          ? node.caseSourceType === CaseSourceType.AREX
            ? 'arex'
            : 'case'
          : undefined;

      navPane({
        type: PanesType.REQUEST,
        id: `${activeWorkspaceId}-${node.nodeType}-${node.infoId}`,
        name: node.nodeName,
        icon,
      });
    }
  };

  const handleAddWorkspace = (workspaceName: string) => {
    createWorkspace({ userName, workspaceName });
  };

  const handleEditWorkspace = (workspaceId: string) => {
    navPane({
      type: PanesType.WORKSPACE,
      id: workspaceId,
      name: workspaces.find((w) => w.id === workspaceId)?.workspaceName,
    });
  };

  const handleLocate = async () => {
    const pathInfo = await FileSystemService.queryPathInfo({
      infoId: value,
      nodeType: parseInt(nodeTypeStr),
    });
    setExpandedKeys(pathInfo.map((path) => path.id));
  };

  return (
    <CollectionWrapper>
      <WorkspacesMenu
        value={activeWorkspaceId}
        options={workspacesOptions}
        onChange={changeActiveWorkspaceId}
        onAdd={handleAddWorkspace}
        onEdit={handleEditWorkspace}
      />
      <CollectionSelect
        height={size?.height && size.height - 100}
        selectedKeys={selectedKeys}
        expandable={[CollectionNodeType.folder]}
        menu={
          <div
            style={{
              height: '21px',
              marginRight: '4px',
              display: 'flex',
              flexFlow: 'row nowrap',
              alignContent: 'center',
            }}
          >
            <TooltipButton
              icon={<PlusOutlined />}
              type='text'
              size='small'
              title={t('collection.create_new')}
              onClick={createCollection}
            />

            <TooltipButton
              icon={<Icon name='ArchiveRestore' />}
              title={t('collection.import_export')}
              onClick={() => collectionsImportExportRef.current?.open()}
            />

            <TooltipButton
              icon={<PlayCircleOutlined />}
              title={t('collection.batch_run')}
              onClick={() => {
                navPane({
                  type: PanesType.BATCH_RUN,
                  id: activeWorkspaceId,
                });
              }}
            />

            <TooltipButton
              icon={<Icon name='Crosshair' />}
              title={t('collection.locate')}
              onClick={handleLocate}
            />
          </div>
        }
        onSelect={handleSelect}
      />
      <CollectionsImportExport ref={collectionsImportExportRef} />
    </CollectionWrapper>
  );
};

const CollectionWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  .collection-content-wrapper {
    padding: 4px 4px;
  }

  .ant-spin-nested-loading,
  .ant-spin {
    height: 100%;
    max-height: 100% !important;
  }

  .collection-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .ant-tree {
    background-color: transparent;
  }

  .ant-tree-node-selected .content {
    color: ${(props) => props.theme.colorText};
  }

  .ant-tree-node-content-wrapper {
    width: 10%;
    overflow-y: visible; //解决拖拽图标被隐藏
    overflow-x: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
  }
`;

export default Collection;
