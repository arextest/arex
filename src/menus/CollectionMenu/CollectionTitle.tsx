import { MoreOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Dropdown, Input, Menu, Popconfirm, Space } from 'antd';
import { ReactNode, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { methodMap } from '../../constant';
import SearchHeighLight from '../../helpers/collection/searchHeighLight';
import { treeFindPath } from '../../helpers/collection/util';
import { generateGlobalPaneId, uuid } from '../../helpers/utils';
import { PagesType } from '../../pages';
import { CollectionService } from '../../services/CollectionService';
import { useStore } from '../../store';
import { MenusType } from '../index';

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

function CollectionTitle({
  val,
  updateDirectoryTreeData,
  treeData,
  callbackOfNewRequest,
  searchValue,
}: any) {
  const _useParams = useParams();
  const {
    userInfo: { email: userName },
    setPages,
  } = useStore();
  const [open, setOpen] = useState(false);
  const [renameKey, setRenameKey] = useState('');
  const [renameValue, setRenameValue] = useState('');
  const menu = (val: any) => {
    const paths = treeFindPath(treeData, (node) => node.key === val.key);
    return (
      <Menu
        onClick={(e) => {
          switch (e.key) {
            case '3':
              CollectionService.addItem({
                id: _useParams.workspaceId,
                nodeName: 'New Collection',
                nodeType: 3,
                parentPath: paths.map((i: any) => i.key),
                userName,
              }).then(() => {
                updateDirectoryTreeData();
              });
              break;
            case '1':
              CollectionService.addItem({
                id: _useParams.workspaceId,
                nodeName: 'New Request',
                nodeType: 1,
                parentPath: paths.map((i: any) => i.key),
                userName,
              }).then((res) => {
                updateDirectoryTreeData();
                callbackOfNewRequest(
                  [res.body.infoId],
                  paths.map((i: any) => i.key),
                  1,
                );
              });
              break;
            case '2':
              CollectionService.addItem({
                id: _useParams.workspaceId,
                nodeName: 'case',
                nodeType: 2,
                parentPath: paths.map((i: any) => i.key),
                userName,
              }).then((res) => {
                updateDirectoryTreeData();
                callbackOfNewRequest(
                  [res.body.infoId],
                  paths.map((i: any) => i.key),
                  2,
                );
              });
              break;
            case '4':
              setRenameKey(val.id);
              setRenameValue(val.title);
              break;
            case '6':
              CollectionService.duplicate({
                id: _useParams.workspaceId,
                path: paths.map((i: any) => i.key),
                userName,
              }).then((res) => {
                console.log(res);
                updateDirectoryTreeData();
              });
            case '7':
              setPages(
                {
                  key: val.id,
                  title: 'BatchRun',
                  pageType: PagesType.BatchRun,
                  menuType: MenusType.Collection,
                  isNew: true,
                  data: undefined,
                  paneId: generateGlobalPaneId(MenusType.Collection, PagesType.BatchRun, val.id),
                  rawId: val.id,
                },
                'push',
              );
          }
          e.domEvent.stopPropagation();
          setOpen(false);
        }}
        items={[
          {
            key: '7',
            label: (
              //必须要用a标签，不然无法disable
              <span className={'dropdown-click-target'}>Run Folder</span>
            ),
            // 只有类型为3才能新增文件夹
            disabled: val.nodeType !== 3,
          },
          {
            key: '3',
            label: (
              //必须要用a标签，不然无法disable
              <span className={'dropdown-click-target'}>Add Folder</span>
            ),
            // 只有类型为3才能新增文件夹
            disabled: val.nodeType !== 3,
          },
          {
            key: '1',
            label: <span className={'dropdown-click-target'}>Add Request</span>,
            disabled: val.nodeType !== 3,
          },
          {
            key: '2',
            label: <span className={'dropdown-click-target'}>Add Case</span>,
            disabled: val.nodeType !== 1,
          },
          {
            key: '4',
            label: <span className={'dropdown-click-target'}>Rename</span>,
          },
          {
            key: '6',
            label: <span className={'dropdown-click-target'}>Duplicate</span>,
          },
          {
            key: '5',
            label: (
              <Popconfirm
                title='Are you sure？'
                okText='Yes'
                cancelText='No'
                onConfirm={() => {
                  CollectionService.removeItem({
                    id: _useParams.workspaceId,
                    removeNodePath: paths.map((i: any) => i.key),
                    userName,
                  }).then((res) => {
                    updateDirectoryTreeData();
                  });
                }}
              >
                <a style={{ color: 'red' }}>Delete</a>
              </Popconfirm>
            ),
          },
        ]}
      />
    );
  };
  const rename = () => {
    const paths = treeFindPath(treeData, (node) => node.key === val.key);
    CollectionService.rename({
      id: _useParams.workspaceId,
      newName: renameValue,
      path: paths.map((i: any) => i.key),
      userName,
    }).then((res) => {
      updateDirectoryTreeData();
      setRenameValue('');
      setRenameKey('');
    });
  };
  const method = useMemo(() => {
    return Object.keys(methodMap).includes(val.method) ? val.method : 'UNKNOWN';
  }, [val]);
  return (
    <>
      <div className={'collection-title-render'}>
        <div className={'left'}>
          {val.nodeType === 1 && (
            <span css={css(`color:${methodMap[method].color};margin-right:4px`)}>{method}</span>
          )}
          {val.nodeType === 2 && <PrefixIcon border icon='case' />}
          <div className={'content'}>
            {renameKey === val.id ? (
              <Input
                autoFocus
                width={'100%'}
                style={{ padding: '0 4px', width: '100%' }}
                value={renameValue}
                onPressEnter={rename}
                onBlur={rename}
                onChange={(val) => setRenameValue(val.target.value)}
              />
            ) : (
              <SearchHeighLight text={val.title} keyword={searchValue} />
            )}
          </div>
        </div>
        <div className='right'>
          <Dropdown overlay={menu(val)} trigger={['click']} open={open} onOpenChange={setOpen}>
            <span onClick={(event) => event.stopPropagation()}>
              <Space>
                <MoreOutlined size={100} style={{ fontSize: '16px' }} />
              </Space>
            </span>
          </Dropdown>
        </div>
      </div>
    </>
  );
}

export default CollectionTitle;
