import { MoreOutlined } from "@ant-design/icons";
import {Dropdown, Menu, Popconfirm, Space} from "antd";
import { useState } from "react";
import { FileSystemService } from "../../api/FileSystem.service";
import { useStore } from "../../store";
import { findPathByKey } from "./util";

function CollectionTitleRender({ val, updateDirectorytreeData }: any) {
  const collectionTree = useStore((state) => state.collectionTree);
  const [visible, setVisible] = useState(false);
  const handleVisibleChange = (flag: boolean) => {
    setVisible(flag);
  };
  const setCollectionCreateAndUpdateModalVisible = useStore(state => state.setCollectionCreateAndUpdateModalVisible)
  const setCollectionCreateAndUpdateModalFolderName = useStore(state => state.setCollectionCreateAndUpdateModalFolderName)
  const setCollectionCreateAndUpdateModalMode = useStore(state => state.setCollectionCreateAndUpdateModalMode)
  const setCollectionCreateAndUpdateModalId = useStore(state => state.setCollectionCreateAndUpdateModalId)
  const menu = (val: any) => {
    const paths = findPathByKey(collectionTree, val.key)
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
                  FileSystemService.addItem({
                    id: "62b3fc610c4d613355bd2b5b",
                    nodeName: 'New Collection',
                    nodeType: 3,
                    parentPath: paths.map(i => i.key),
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
                  FileSystemService.addItem({
                    id: "62b3fc610c4d613355bd2b5b",
                    nodeName: 'New Request',
                    nodeType: 1,
                    parentPath: paths.map(i => i.key),
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
                  FileSystemService.addItem({
                    id: "62b3fc610c4d613355bd2b5b",
                    nodeName: 'eg',
                    nodeType: 2,
                    parentPath: paths.map(i => i.key),
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
                  setCollectionCreateAndUpdateModalVisible(true)
                  setCollectionCreateAndUpdateModalMode('rename')
                  setCollectionCreateAndUpdateModalId(val.key)
                  setCollectionCreateAndUpdateModalFolderName(val.title)
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
            FileSystemService.removeItem({ id: '62b3fc610c4d613355bd2b5b', removeNodePath: paths.map(i => i.key) }).then(res => {
              updateDirectorytreeData()
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
            val.type === 1 ? <span style={{ color: '#10B981', marginRight: '12px' }}>GET</span> : null
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
    </div>
  );
}

export default CollectionTitleRender;
