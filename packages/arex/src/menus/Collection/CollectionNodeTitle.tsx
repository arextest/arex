import { ExclamationCircleFilled, MoreOutlined } from '@ant-design/icons';
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

  const nodePath = useMemo(() => getPath(props.data.infoId), [props.data]);

  const showPropsConfirm = (id: string) => {
    confirm({
      title: t('are_you_sure'),
      icon: <ExclamationCircleFilled />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        FileSystemService.removeCollectionItem({
          id: activeWorkspaceId,
          removeNodePath: nodePath,
          userName,
        }).then(() => {
          // updateDirectoryTreeData();
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const menu: MenuProps = useMemo(
    () => ({
      items: [
        {
          key: '7',
          label: (
            <span className={'dropdown-click-target'}>
              {t('collection.batch_run', { ns: 'components' })}
            </span>
          ),
          disabled: props.data.nodeType !== 3,
        },
        {
          key: '3',
          label: (
            <span className={'dropdown-click-target'}>
              {t('collection.add_folder', { ns: 'components' })}
            </span>
          ),
          // 只有类型为3才能新增文件夹
          disabled: props.data.nodeType !== 3,
        },
        {
          key: '1',
          label: (
            <span className={'dropdown-click-target'}>
              {t('collection.add_request', { ns: 'components' })}
            </span>
          ),
          disabled: props.data.nodeType !== 3,
        },
        {
          key: '2',
          label: (
            <span className={'dropdown-click-target'}>
              {t('collection.add_case', { ns: 'components' })}
            </span>
          ),
          disabled: props.data.nodeType !== 1,
        },
        {
          key: '4',
          label: (
            <span className={'dropdown-click-target'}>
              {t('collection.rename', { ns: 'components' })}
            </span>
          ),
        },
        {
          key: '6',
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
              // onClick={() => {
              //   showPropsConfirm(paths);
              // }}
            >
              {t('collection.delete', { ns: 'components' })}
            </a>
          ),
        },
      ],
      onClick(e) {
        switch (e.key) {
          case '3':
            FileSystemService.addCollectionItem({
              id: activeWorkspaceId,
              nodeName: 'New Collection',
              nodeType: 3,
              parentPath: nodePath,
              userName,
            })
              .then(() => {
                getCollections();
              })
              .catch((e) => message.error(e));
            break;
          case '1':
            FileSystemService.addCollectionItem({
              id: activeWorkspaceId,
              nodeName: 'New Request',
              nodeType: CollectionNodeType.interface,
              parentPath: nodePath,
              userName,
            }).then((res) => {
              getCollections();
              // TODO 展开新增行
              // callbackOfNewRequest(
              //   [res.infoId],
              //   nodePath,
              //   1,
              // );
            });
            break;
          case '2':
            FileSystemService.addCollectionItem({
              id: activeWorkspaceId,
              nodeName: 'case',
              nodeType: CollectionNodeType.case,
              parentPath: nodePath,
              userName,
              caseSourceType: 2,
            }).then((res) => {
              // FileSystemService.queryInterface({ id: paths[paths.length - 1].key }).then(
              //   (parentInterface) => {
              //     FileSystemService.saveCase({
              //       workspaceId: activeWorkspaceId as string,
              //       ...parentInterface,
              //       id: res.body.infoId,
              //     }).then((_) => {
              //       updateDirectoryTreeData();
              //       callbackOfNewRequest(
              //         [res.body.infoId],
              //         nodePath,
              //         2,
              //       );
              //     });
              //   },
              // );
            });
            break;
          case '4':
            setEditMode(true);
            break;
          case '6':
            FileSystemService.duplicateCollectionItem({
              id: activeWorkspaceId,
              path: nodePath,
              userName,
            }).then(() => {
              getCollections(activeWorkspaceId);
            });
            break;
          case '7':
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

  const rename = () => {
    FileSystemService.renameCollectionItem({
      id: activeWorkspaceId,
      newName: nodeName,
      path: nodePath,
      userName,
    }).then(() => {
      getCollections(activeWorkspaceId);
      setNodeName('');
      setEditMode(false);
    });
  };

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
              value={nodeName}
              onPressEnter={rename}
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
