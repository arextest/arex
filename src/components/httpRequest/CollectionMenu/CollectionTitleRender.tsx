import { ApiOutlined, MoreOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Popconfirm, Space } from 'antd';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { treeFindPath } from '../../../helpers/collection/util';
import { CollectionService } from '../../../services/CollectionService';
// import { findPathByKey } from "../../helpers/collection/util";
import CreateAndUpdateFolder from './CreateAndUpdateFolder';

function CollectionTitleRender({
  val,
  updateDirectoryTreeData,
  treeData,
  callbackOfNewRequest,
}: any) {
  const _useParams = useParams();
  const _useNavigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const handleVisibleChange = (flag: boolean) => {
    setVisible(flag);
  };
  const [CollectionCreateAndUpdateModal, setCollectionCreateAndUpdateModal] = useState({});
  const menu = (val: any) => {
    const paths = treeFindPath(treeData, (node) => node.key === val.key);
    return (
      <Menu
        onClick={(e) => {
          e.domEvent.stopPropagation();
          setVisible(false);
        }}
        items={[
          {
            key: '1',
            label: (
              <a
                target='_blank'
                onClick={() => {
                  CollectionService.addItem({
                    id: _useParams.workspaceId,
                    nodeName: 'New Collection',
                    nodeType: 3,
                    parentPath: paths.map((i: any) => i.key),
                    userName: localStorage.getItem('email'),
                  }).then(() => {
                    updateDirectoryTreeData();
                  });
                }}
              >
                New Folder
              </a>
            ),
            // 只有类型为3才能新增文件夹
            disabled: val.nodeType !== 3,
          },
          {
            key: '2',
            label: (
              <a
                target='_blank'
                onClick={() => {
                  CollectionService.addItem({
                    id: _useParams.workspaceId,
                    nodeName: 'New Request',
                    nodeType: 1,
                    parentPath: paths.map((i: any) => i.key),
                    userName: localStorage.getItem('email'),
                  }).then((res) => {
                    console.log(res.data.body.infoId);
                    updateDirectoryTreeData();
                    callbackOfNewRequest(
                      [res.data.body.infoId],
                      paths.map((i: any) => i.key),
                      1,
                    );
                  });
                }}
              >
                New Request
              </a>
            ),
            disabled: val.nodeType !== 3,
          },
          {
            key: '3',
            label: (
              <a
                target='_blank'
                onClick={() => {
                  CollectionService.addItem({
                    id: _useParams.workspaceId,
                    nodeName: 'case',
                    nodeType: 2,
                    parentPath: paths.map((i: any) => i.key),
                    userName: localStorage.getItem('email'),
                  }).then((res) => {
                    updateDirectoryTreeData();
                    callbackOfNewRequest(
                      [res.data.body.infoId],
                      paths.map((i: any) => i.key),
                      2,
                    );
                  });
                }}
              >
                New Case
              </a>
            ),
            disabled: val.nodeType !== 1,
          },
          {
            key: '4',
            label: (
              <a
                target='_blank'
                onClick={() => {
                  const collectionCreateAndUpdateModal = {
                    collectionCreateAndUpdateModalVisible: true,
                    collectionCreateAndUpdateModalMode: 'rename',
                    collectionCreateAndUpdateModalId: val.key,
                    collectionCreateAndUpdateModalFolderName: val.title,
                  };
                  setCollectionCreateAndUpdateModal(collectionCreateAndUpdateModal);
                }}
              >
                Rename
              </a>
            ),
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
                    userName:localStorage.getItem('email')
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
  return (
    <>
      <div className={'collection-title-render'}>
        <div className={'left'}>
          {val.nodeType === 1 && val.nodeType === 1 ? (
            <ApiOutlined style={{ color: '#5C4033', marginRight: '8px' }} />
          ) : null}
          {val.nodeType === 2 ? (
            <span
              style={{
                color: '#5C4033',
                marginRight: '8px',
                border: '1px solid #5C4033',
                fontSize: '10px',
                display: 'block',
                lineHeight: '12px',
              }}
            >
              case
            </span>
          ) : null}
          <div className={'content'}>{val.title}</div>
        </div>
        <div className='right'>
          <Dropdown
            overlay={menu(val)}
            trigger={['click']}
            visible={visible}
            onVisibleChange={handleVisibleChange}
          >
            <span onClick={(event) => event.stopPropagation()}>
              <Space>
                <MoreOutlined size={100} style={{ fontSize: '16px' }} />
              </Space>
            </span>
          </Dropdown>
        </div>
      </div>
      <CreateAndUpdateFolder
        updateDirectoryTreeData={updateDirectoryTreeData}
        collectionTree={treeData}
        collectionCreateAndUpdateModal={CollectionCreateAndUpdateModal}
      />
    </>
  );
}

export default CollectionTitleRender;
