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
import { App, Button, Dropdown, Input, InputRef, MenuProps, Space, theme } from 'antd';
import React, { FC, ReactNode, useMemo, useRef, useState } from 'react';

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
  pos?: number[] | string[];
  selectable?: CollectionNodeType[];
  onAddNode?: (info: string, nodeType: CollectionNodeType) => void;
};

const CollectionNodeTitle: FC<CollectionNodeTitleProps> = (props) => {
  const {
    selectable = [CollectionNodeType.folder, CollectionNodeType.interface, CollectionNodeType.case],
  } = props;
  const { activeWorkspaceId } = useWorkspaces();
  const {
    getPathByIndexOrPath,
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

  const editInputRef = useRef<InputRef>(null);

  const [editMode, setEditMode] = useState(false);
  const [nodeName, setNodeName] = useState(props.data.nodeName);

  const path = useMemo(() => getPathByIndexOrPath(props.pos), [props.pos]);

  const { run: addCollectionItem } = useRequest(
    (params: { nodeName: string; nodeType: CollectionNodeType; caseSourceType?: number }) =>
      FileSystemService.addCollectionItem({
        ...params,
        userName,
        id: activeWorkspaceId,
        parentPath: path,
      }),
    {
      manual: true,
      onSuccess: async (res, [{ caseSourceType, nodeName, nodeType }]) => {
        // case inherit interface
        if (caseSourceType === CaseSourceType.CASE)
          await createCaseInheritInterface(props.data.infoId, res.infoId);
        addCollectionNode({
          infoId: res.infoId,
          nodeName,
          nodeType,
          caseSourceType,
          pathOrIndex: props.pos || [],
        });
        props.onAddNode?.(res.infoId, nodeType);
      },
    },
  );

  const { run: duplicateCollectionItem } = useRequest(
    () =>
      FileSystemService.duplicateCollectionItem({
        id: activeWorkspaceId,
        path,
      }),
    {
      manual: true,
      onSuccess: (res) => {
        duplicateCollectionNode(props.pos || [], res.infoId);
      },
    },
  );

  const { run: rename } = useRequest(
    () =>
      FileSystemService.renameCollectionItem({
        id: activeWorkspaceId,
        newName: nodeName,
        path,
      }),
    {
      manual: true,
      onSuccess(success) {
        if (success) {
          setEditMode(false);
          renameCollectionNode(props.pos || [], nodeName);
        }
      },
    },
  );

  const { run: removeCollectionItem } = useRequest(FileSystemService.removeCollectionItem, {
    manual: true,
    onSuccess: (success) => {
      if (success) {
        const id = `${activeWorkspaceId}-${props.data.nodeType}-${props.data.infoId}`;
        const paneKey = encodePaneKey({ id, type: PanesType.REQUEST });
        removePane(paneKey);
        removeCollectionNode(props.pos || []);
      }
    },
  });

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
            <a
              onClick={() => {
                setEditMode(true);
                setTimeout(() => editInputRef?.current?.focus());
              }}
            >
              {t('collection.rename', { ns: 'components' })}
            </a>
          ),
        },
        {
          key: 'duplicate',
          label: (
            <a onClick={duplicateCollectionItem}>
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
                  onOk: () =>
                    removeCollectionItem({
                      id: activeWorkspaceId,
                      removeNodePath: path,
                    }),
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
                ref={editInputRef}
                value={nodeName}
                onPressEnter={rename}
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
              <SmallTextButton icon={<CheckOutlined />} onClick={rename} />
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
              className='node-menu'
              icon={<MoreOutlined className='node-menu-icon' style={{ fontSize: '14px' }} />}
              onClick={(e) => {
                // e.stopPropagation();
                // 此处传递冒泡，在Tree onSelect 事件中会阻止冒泡，目的为了更新点击节点的 pos
              }}
            />
          </Dropdown>
        </div>
      )}
    </CollectionNodeTitleWrapper>
  );
};

export default CollectionNodeTitle;
