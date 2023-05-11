import { ExclamationCircleFilled, MoreOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { App, Button, Dropdown, Input, MenuProps } from 'antd';
import { getLocalStorage, RequestMethodIcon, styled, useTranslation } from 'arex-core';
import React, { FC, ReactNode, useMemo, useState } from 'react';

import { CollectionNodeType, EMAIL_KEY } from '@/constant';
import { FileSystemService } from '@/services';
import { CollectionType } from '@/services/FileSystemService';
import { useCollections, useWorkspaces } from '@/store';

import SearchHighLight from './SearchHighLight';

const PrefixIcon = styled(
  (props: { icon: ReactNode; border?: boolean }) => <div {...props}>{props.icon}</div>,
  { shouldForwardProp: (prop) => prop !== 'border' },
)`
  margin-right: 6px;
  border: ${(props) => (props.border ? '1px solid' : 'none')};
  font-size: 12px;
  display: block;
  line-height: 12px;
`;

const CollectionNodeTitleWrapper = styled.div`
  color: ${(props) => props.theme.colorTextSecondary};
  display: flex;
  .right {
    float: right;
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
  keyword: string;
};

const CollectionNodeTitle: FC<CollectionNodeTitleProps> = (props) => {
  const { modal, message } = App.useApp();
  const confirm = modal.confirm;

  const { t } = useTranslation(['common', 'components']);
  const { activeWorkspaceId } = useWorkspaces();
  const { getCollections, getPath } = useCollections();

  const userName = getLocalStorage<string>(EMAIL_KEY) as string;

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [nodeName, setNodeName] = useState(props.data.nodeName);

  const nodePath = useMemo(() => getPath(props.data.infoId), [getPath, props.data.infoId]);

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
      onSuccess: (res, [{ caseSourceType }]) => {
        if (res.success) {
          getCollections();
          // TODO 展开新增行

          if (caseSourceType === 2) {
            queryInterface({ id: nodePath.at(-1) as string }, res.infoId);
          }
        }
      },
    },
  );

  const { run: removeCollectionItem } = useRequest(
    () =>
      FileSystemService.removeCollectionItem({
        id: activeWorkspaceId,
        removeNodePath: nodePath,
        userName,
      }),
    {
      manual: true,
      onSuccess: () => {
        getCollections();
      },
    },
  );

  const { run: saveCase } = useRequest(FileSystemService.saveCase, {
    manual: true,
    onSuccess: () => {
      getCollections();
    },
  });

  const { run: queryInterface } = useRequest(FileSystemService.queryInterface, {
    manual: true,
    onSuccess: (parentInterface, params) => {
      saveCase({
        workspaceId: activeWorkspaceId as string,
        ...parentInterface,
        id: params[1],
      });
    },
  });

  const showPropsConfirm = () => {
    confirm({
      title: t('are_you_sure'),
      icon: <ExclamationCircleFilled />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: removeCollectionItem,
    });
  };

  const menu: MenuProps = useMemo(
    () => ({
      items: [
        {
          key: 'batchRun',
          label: (
            <span className={'dropdown-click-target'}>
              {t('collection.batch_run', { ns: 'components' })}
            </span>
          ),
          disabled: props.data.nodeType !== CollectionNodeType.folder,
        },
        {
          key: 'addFolder',
          label: (
            <span className={'dropdown-click-target'}>
              {t('collection.add_folder', { ns: 'components' })}
            </span>
          ),
          // 只有类型为3才能新增文件夹
          disabled: props.data.nodeType !== CollectionNodeType.folder,
        },
        {
          key: 'addRequest',
          label: (
            <span className={'dropdown-click-target'}>
              {t('collection.add_request', { ns: 'components' })}
            </span>
          ),
          disabled: props.data.nodeType !== CollectionNodeType.interface,
        },
        {
          key: 'addCase',
          label: (
            <span className={'dropdown-click-target'}>
              {t('collection.add_case', { ns: 'components' })}
            </span>
          ),
          disabled: props.data.nodeType !== CollectionNodeType.interface,
        },
        {
          key: 'rename',
          label: (
            <span className={'dropdown-click-target'}>
              {t('collection.rename', { ns: 'components' })}
            </span>
          ),
        },
        {
          key: 'duplicate',
          label: (
            <span className={'dropdown-click-target'}>
              {t('collection.duplicate', { ns: 'components' })}
            </span>
          ),
        },
        {
          key: '5',
          label: (
            <a
              style={{ color: 'red' }}
              onClick={() => {
                showPropsConfirm();
              }}
            >
              {t('collection.delete', { ns: 'components' })}
            </a>
          ),
        },
      ],
      onClick(e) {
        switch (e.key) {
          case 'addFolder':
            addCollectionItem({
              nodeName: 'New Collection',
              nodeType: CollectionNodeType.folder,
            });
            break;
          case 'addRequest':
            addCollectionItem({
              nodeName: 'New Request',
              nodeType: CollectionNodeType.interface,
            });
            break;
          case 'addCase':
            addCollectionItem({
              nodeName: 'case',
              nodeType: CollectionNodeType.case,
              caseSourceType: 2,
            });
            break;
          case 'rename':
            setEditMode(true);
            break;
          case 'duplicate':
            FileSystemService.duplicateCollectionItem({
              id: activeWorkspaceId,
              path: nodePath,
              userName,
            }).then(() => {
              getCollections(activeWorkspaceId);
            });
            break;
          case 'batchRun':
            // to BatchRun pane
            // customNavigate(`/${activeWorkspaceId}/${PagesType.BatchRun}/${props.data.id}`);
            break;
        }
        e.domEvent.stopPropagation();
        setOpen(false);
      },
    }),
    [activeWorkspaceId, userName],
  );

  const { run: rename } = useRequest(
    () =>
      FileSystemService.renameCollectionItem({
        id: activeWorkspaceId,
        newName: nodeName,
        path: nodePath,
        userName,
      }),
    {
      manual: true,
      onSuccess(success) {
        setEditMode(false);
        getCollections(activeWorkspaceId);
      },
    },
  );

  const prefix = useMemo(
    () =>
      props.data.nodeType === 1 ? (
        React.createElement(
          RequestMethodIcon[props.data.method || 'QuestionOutlined'] ||
            RequestMethodIcon['QuestionOutlined'],
        )
      ) : props.data.nodeType === 2 ? (
        <PrefixIcon border icon={props.data.caseSourceType === 1 ? 'arex' : 'case'} />
      ) : null,
    [props.data],
  );

  return (
    <CollectionNodeTitleWrapper>
      <div className={'left'}>
        {prefix}
        <div className={'content'}>
          {editMode ? (
            <Input
              onPressEnter={rename}
              value={nodeName}
              onBlur={rename}
              onChange={(e) => setNodeName(e.currentTarget.value)}
              style={{ padding: '0 4px', width: '100%' }}
            />
          ) : (
            <SearchHighLight text={props.data.nodeName} keyword={props.keyword} />
          )}
        </div>
      </div>

      <div className='right'>
        <Dropdown menu={menu} trigger={['click']} open={open} onOpenChange={setOpen}>
          <Button
            type='text'
            size='small'
            icon={<MoreOutlined style={{ fontSize: '14px' }} />}
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      </div>
    </CollectionNodeTitleWrapper>
  );
};

export default CollectionNodeTitle;
