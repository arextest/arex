import {
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleFilled,
  FolderOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import {
  getLocalStorage,
  RequestMethodIcon,
  SmallTextButton,
  styled,
  useTranslation,
} from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Button, Dropdown, Input, MenuProps, Space, theme } from 'antd';
import React, { FC, ReactNode, useMemo, useState } from 'react';

import { CollectionNodeType, EMAIL_KEY, PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { FileSystemService } from '@/services';
import { CollectionType } from '@/services/FileSystemService';
import { useCollections, useMenusPanes, useWorkspaces } from '@/store';
import { CaseSourceType } from '@/store/useCollections';
import { encodePaneKey } from '@/store/useMenusPanes';

import SearchHighLight from '../SearchHighLight';

const CollectionNodeTitleWrapper = styled.div<{ disabled?: boolean }>`
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  color: ${(props) => props.theme.colorTextSecondary};
  filter: ${(props) => (props.disabled ? 'grayscale(100%) opacity(35%)' : 'none')};
  display: flex;
  .right {
    float: right;
    opacity: 0;
    transition: opacity ease 0.3s;
  }
  &:hover {
    .right {
      opacity: 1;
    }
  }
  .left {
    flex: 1;
    overflow: hidden;
    display: flex;
    align-items: center;
    .content {
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; //溢出不换行
    }
  }
  :hover {
    color: ${(props) => props.theme.colorText};
  }
`;

export type CollectionNodeTitleProps = {
  data: CollectionType;
  keyword?: string;
  readOnly?: boolean;
  selectable?: CollectionNodeType[];
  onAddNode?: (info: string, nodeType: CollectionNodeType) => void;
};

const CollectionNodeTitle: FC<CollectionNodeTitleProps> = (props) => {
  const {
    selectable = [CollectionNodeType.folder, CollectionNodeType.interface, CollectionNodeType.case],
  } = props;
  const { activeWorkspaceId } = useWorkspaces();
  const {
    getPath,
    addCollectionNode,
    renameCollectionNode,
    removeCollectionNode,
    duplicateCollectionNode,
  } = useCollections();
  const { removePane } = useMenusPanes();

  const { modal } = App.useApp();
  const { token } = theme.useToken();
  const confirm = modal.confirm;
  const { t } = useTranslation(['common', 'components']);
  const navPane = useNavPane();

  const userName = getLocalStorage<string>(EMAIL_KEY) as string;

  const [editMode, setEditMode] = useState(false);
  const [nodeName, setNodeName] = useState(props.data.nodeName);

  const nodePath = useMemo(
    () => getPath(props.data.infoId).map((path) => path.id),
    [getPath, props.data.infoId],
  );

  const { run: addCollectionItem } = useRequest(
    (params: { nodeName: string; nodeType: CollectionNodeType; caseSourceType?: number }) =>
      FileSystemService.addCollectionItem({
        ...params,
        userName,
        id: activeWorkspaceId,
        parentPath: nodePath,
      }),
    {
      manual: true,
      onSuccess: async (res, [{ caseSourceType, nodeName, nodeType }]) => {
        // case inherit interface
        const parentId = nodePath[nodePath.length - 1] as string;
        if (caseSourceType === CaseSourceType.CASE)
          await createCaseInheritInterface(parentId, res.infoId);

        addCollectionNode({
          infoId: res.infoId,
          nodeName,
          nodeType,
          parentIds: nodePath,
          caseSourceType,
        });
        props.onAddNode?.(res.infoId, nodeType);
      },
    },
  );

  const { run: duplicateCollectionItem } = useRequest(
    (path: string[]) =>
      FileSystemService.duplicateCollectionItem({
        id: activeWorkspaceId,
        path,
        userName,
      }),
    {
      manual: true,
      onSuccess: (res) => {
        duplicateCollectionNode(props.data.infoId, res.infoId);
      },
    },
  );

  const { run: rename } = useRequest(
    (path: string[]) =>
      FileSystemService.renameCollectionItem({
        path,
        userName,
        newName: nodeName,
        id: activeWorkspaceId,
      }),
    {
      manual: true,
      onSuccess(success) {
        if (success) {
          setEditMode(false);
          renameCollectionNode(props.data.infoId, nodeName);
        }
      },
    },
  );

  const { run: removeCollectionItem } = useRequest(
    (removeNodePath: string[]) =>
      FileSystemService.removeCollectionItem({
        id: activeWorkspaceId,
        removeNodePath,
        userName,
      }),
    {
      manual: true,
      onSuccess: (success) => {
        if (success) {
          const id = `${activeWorkspaceId}-${props.data.nodeType}-${props.data.infoId}`;
          const paneKey = encodePaneKey({ id, type: PanesType.REQUEST });
          removePane(paneKey);
          removeCollectionNode(props.data.infoId);
        }
      },
    },
  );

  const { runAsync: createCaseInheritInterface } = useRequest(
    (id: string, infoId: string) =>
      new Promise((resolve, reject) => {
        FileSystemService.queryInterface(id).then((res) => {
          FileSystemService.saveCase({
            workspaceId: activeWorkspaceId as string,
            ...res,
            id: infoId,
          })
            .then(resolve)
            .catch(reject);
        });
      }),
    {
      manual: true,
    },
  );

  const menu: MenuProps = {
    items: (
      [] as {
        key: string;
        label: ReactNode;
      }[]
    )
      .concat(
        props.data.nodeType === CollectionNodeType.folder
          ? [
              {
                key: 'batchRun',
                label: (
                  <a
                    onClick={() => {
                      navPane({
                        type: PanesType.BATCH_RUN,
                        id: `${activeWorkspaceId}-${props.data.infoId}`,
                      });
                    }}
                  >
                    {t('collection.batch_run', { ns: 'components' })}
                  </a>
                ),
              },
              {
                key: 'addFolder',
                label: (
                  <a
                    onClick={() =>
                      addCollectionItem({
                        nodeName: 'New Collection',
                        nodeType: CollectionNodeType.folder,
                      })
                    }
                  >
                    {t('collection.add_folder', { ns: 'components' })}
                  </a>
                ),
              },
              {
                key: 'addRequest',
                label: (
                  <a
                    onClick={() =>
                      addCollectionItem({
                        nodeName: 'New Request',
                        nodeType: CollectionNodeType.interface,
                      })
                    }
                  >
                    {t('collection.add_request', { ns: 'components' })}
                  </a>
                ),
              },
            ]
          : [],
      )
      .concat(
        props.data.nodeType === CollectionNodeType.interface
          ? [
              {
                key: 'addCase',
                label: (
                  <a
                    onClick={() => {
                      addCollectionItem({
                        nodeName: 'case',
                        nodeType: CollectionNodeType.case,
                        caseSourceType: CaseSourceType.CASE,
                      });
                    }}
                  >
                    {t('collection.add_case', { ns: 'components' })}
                  </a>
                ),
              },
            ]
          : [],
      )
      .concat([
        {
          key: 'rename',
          label: (
            <a onClick={() => setEditMode(true)}>{t('collection.rename', { ns: 'components' })}</a>
          ),
        },
        {
          key: 'duplicate',
          label: (
            <a onClick={() => duplicateCollectionItem(nodePath)}>
              {t('collection.duplicate', { ns: 'components' })}
            </a>
          ),
        },
        {
          key: 'delete',
          label: (
            <a
              style={{ color: 'red' }}
              onClick={() => {
                confirm({
                  title: t('are_you_sure'),
                  icon: <ExclamationCircleFilled />,
                  okText: 'Yes',
                  okType: 'danger',
                  cancelText: 'No',
                  onOk: () => removeCollectionItem(nodePath),
                });
              }}
            >
              {t('collection.delete', { ns: 'components' })}
            </a>
          ),
        },
      ]),
    onClick(e) {
      e.domEvent.stopPropagation();
    },
  };

  const prefix = useMemo(
    () =>
      props.data.nodeType === CollectionNodeType.folder ? (
        <FolderOutlined style={{ marginRight: token.marginXS }} />
      ) : props.data.nodeType === CollectionNodeType.interface ? (
        React.createElement(RequestMethodIcon[props.data.method || ''] || 'div')
      ) : props.data.nodeType === CollectionNodeType.case ? (
        React.createElement(
          RequestMethodIcon[props.data.caseSourceType === CaseSourceType.AREX ? 'arex' : 'case'] ||
            'div',
        )
      ) : null,
    [props.data],
  );

  const disabled = useMemo(
    () => !selectable?.includes(props.data.nodeType),
    [props.data.nodeType, selectable],
  );

  return (
    <CollectionNodeTitleWrapper
      disabled={disabled}
      className={'ant-tree-treenode-disabled'}
      onClick={(e) => {
        if (!disabled) return;
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <div className={'left'}>
        {prefix}
        <div className={'content'}>
          {editMode ? (
            <Space style={{ display: 'flex' }}>
              <Input
                value={nodeName}
                onPressEnter={() => rename(nodePath)}
                onChange={(e) => setNodeName(e.currentTarget.value)}
                style={{ padding: '0 4px' }}
              />
              <SmallTextButton
                icon={<CloseOutlined />}
                onClick={() => {
                  setEditMode(false);
                  setNodeName(props.data.nodeName);
                }}
              />
              <SmallTextButton icon={<CheckOutlined />} onClick={() => rename(nodePath)} />
            </Space>
          ) : (
            <SearchHighLight text={props.data.nodeName} keyword={props.keyword} />
          )}
        </div>
      </div>

      {!props.readOnly && (
        <div className='right'>
          <Dropdown menu={menu} trigger={['click']}>
            <Button
              type='text'
              size='small'
              icon={<MoreOutlined style={{ fontSize: '14px' }} />}
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        </div>
      )}
    </CollectionNodeTitleWrapper>
  );
};

export default CollectionNodeTitle;
