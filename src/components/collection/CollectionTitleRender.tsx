import { MoreOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Popconfirm, Space } from "antd";
import { useState } from "react";
import { CollectionService } from "../../services/CollectionService";
import { findPathByKey } from "../../helpers/collection/util";
import CreateAndUpdateFolder from "./CreateAndUpdateFolder";

function CollectionTitleRender({ val, updateDirectorytreeData ,treeData, currentWorkspaceId}: any) {
  const [visible, setVisible] = useState(false);
  const handleVisibleChange = (flag: boolean) => {
    setVisible(flag);
  };
  const [CollectionCreateAndUpdateModal,setCollectionCreateAndUpdateModal] = useState({})
  const menu = (val: any) => {
    const paths = findPathByKey(treeData, val.key)
    return (
      <Menu
        onClick={
          (e) => {
            e.domEvent.stopPropagation();
            setVisible(false);
          }
        }
        items={[
          {
            key: "1",
            label: (
              <a
                target="_blank"
                onClick={() => {
                  CollectionService.addItem({
                    id: currentWorkspaceId,
                    nodeName: 'New Collection',
                    nodeType: 3,
                    parentPath: paths.map((i:any)=> i.key),
                    userName: "zt",
                  }).then(() => {
                    updateDirectorytreeData()
                  });
                }}
              >
                New Folder
              </a>
            ),
            // 只有类型为3才能新增文件夹
            disabled: val.type !== 3,
          },
          {
            key: "2",
            label: (
              <a
                target="_blank"
                onClick={() => {
                  CollectionService.addItem({
                    id: currentWorkspaceId,
                    nodeName: 'New Request',
                    nodeType: 1,
                    parentPath: paths.map((i:any)=> i.key),
                    userName: "zt",
                  }).then(() => {
                    updateDirectorytreeData()
                  });
                }}
              >
                New Request
              </a>
            ),
            disabled: val.type !== 3,
          },
          {
            key: "3",
            label: (
              <a
                target="_blank"
                onClick={() => {
                  CollectionService.addItem({
                    id: currentWorkspaceId,
                    nodeName: 'eg',
                    nodeType: 2,
                    parentPath: paths.map((i:any) => i.key),
                    userName: "zt",
                  }).then(() => {
                    updateDirectorytreeData()
                  });
                }}
              >
                New Case
              </a>
            ),
            disabled: val.type !== 1,
          },
          {
            key: "4",
            label: (
              <a
                target="_blank"
                onClick={() => {
                  const collectionCreateAndUpdateModal={
                    collectionCreateAndUpdateModalVisible:true,
                    collectionCreateAndUpdateModalMode:'rename',
                    collectionCreateAndUpdateModalId:val.key,
                    collectionCreateAndUpdateModalFolderName:val.title
                  }
                  setCollectionCreateAndUpdateModal(collectionCreateAndUpdateModal);
                }}
              >
                Rename
              </a>
            ),
          },
          {
            key: "5",
            label: (

          <Popconfirm title="Are you sure？" okText="Yes" cancelText="No" onConfirm={() => {
            CollectionService.removeItem({ id: currentWorkspaceId, removeNodePath: paths.map((i:any) => i.key) }).then(res => {
              updateDirectorytreeData();
            })
          }}>
            <a
              style={{ color: 'red' }}>
              Delete
            </a>
          </Popconfirm>
            ),
          },
        ]}
      />
    );
  };
  return (
    <div className={"collection-title-render"}>
      <div className={"wrap"}>
        <div>
          {
            val.nodeType===1&&val.type === 1 ? <span style={{ color: '#10B981', marginRight: '12px' }}>GET</span> : null
          }
          {
            val.nodeType ===2 ? <span style={{ color: '#5C4033', marginRight: '12px' }}>eg</span> : null
          }
          {val.title}
        </div>
        <Dropdown
          overlay={menu(val)}
          trigger={["click"]}
          visible={visible}
          onVisibleChange={handleVisibleChange}
        >
                <span onClick={(event) => event.stopPropagation()}>
                  <Space>
                    <MoreOutlined size={100} style={{ fontSize: '16px' }}/>
                  </Space>
                </span>
        </Dropdown>
      </div>
      <CreateAndUpdateFolder updateDirectorytreeData={updateDirectorytreeData} collectionTree={treeData} collectionCreateAndUpdateModal={CollectionCreateAndUpdateModal}></CreateAndUpdateFolder>
    </div>
  );
}

export default CollectionTitleRender;
