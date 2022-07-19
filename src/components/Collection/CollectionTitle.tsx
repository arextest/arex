import { MoreOutlined } from "@ant-design/icons";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Dropdown, Menu, Popconfirm } from "antd";
import { useState } from "react";

import { FileSystemService } from "../../api/FileSystem.service";
import { METHODS } from "../../constant";
import { useStore } from "../../store";
import { findPathByKey } from "./util";

const CollectionTitleWrapper = styled.div`
  font-weight: 500;
  & > *:last-of-type {
    font-size: 16px;
    float: right;
    margin-top: 4px;
  }
`;

const RequestMethod = (props: { method: typeof METHODS[number] }) => (
  <span
    css={css`
      color: #10b981;
      margin-right: 8px;
      font-size: 12px;
    `}
  >
    {props.method}
  </span>
);

function CollectionTitle({ val, updateDirectoryTreeData }: any) {
  const collectionTree = useStore((state) => state.collectionTree);
  const [visible, setVisible] = useState(false);
  const handleVisibleChange = (flag: boolean) => {
    setVisible(flag);
  };
  const setCollectionCreateAndUpdateModalVisible = useStore(
    (state) => state.setCollectionCreateAndUpdateModalVisible
  );
  const setCollectionCreateAndUpdateModalFolderName = useStore(
    (state) => state.setCollectionCreateAndUpdateModalFolderName
  );
  const setCollectionCreateAndUpdateModalMode = useStore(
    (state) => state.setCollectionCreateAndUpdateModalMode
  );
  const setCollectionCreateAndUpdateModalId = useStore(
    (state) => state.setCollectionCreateAndUpdateModalId
  );
  const menu = (val: any) => {
    const paths = findPathByKey(collectionTree, val.key);
    return (
      <Menu
        onClick={(e) => {
          e.domEvent.stopPropagation();
          setVisible(false);
        }}
        items={[
          {
            key: "1",
            label: (
              <a
                target="_blank"
                onClick={() => {
                  FileSystemService.addItem({
                    id: "62b3fc610c4d613355bd2b5b",
                    nodeName: "New Collection",
                    nodeType: 3,
                    parentPath: paths.map((i) => i.key),
                    userName: "zt",
                  }).then(() => {
                    updateDirectoryTreeData();
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
                    nodeName: "New Request",
                    nodeType: 1,
                    parentPath: paths.map((i) => i.key),
                    userName: "zt",
                  }).then(() => {
                    updateDirectoryTreeData();
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
                    nodeName: "eg",
                    nodeType: 2,
                    parentPath: paths.map((i) => i.key),
                    userName: "zt",
                  }).then(() => {
                    updateDirectoryTreeData();
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
                  setCollectionCreateAndUpdateModalVisible(true);
                  setCollectionCreateAndUpdateModalMode("rename");
                  setCollectionCreateAndUpdateModalId(val.key);
                  setCollectionCreateAndUpdateModalFolderName(val.title);
                }}
              >
                Rename
              </a>
            ),
          },
          {
            key: "5",
            label: (
              <Popconfirm
                title="Are you sure？"
                okText="Yes"
                cancelText="No"
                placement="left"
                onConfirm={() => {
                  FileSystemService.removeItem({
                    id: "62b3fc610c4d613355bd2b5b",
                    removeNodePath: paths.map((i) => i.key),
                  }).then((res) => {
                    updateDirectoryTreeData();
                  });
                }}
              >
                <a
                  style={{ color: "red" }}
                  onClick={(e) => e.stopPropagation()}
                >
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
    <CollectionTitleWrapper>
      {val.type === 1 ? <RequestMethod method="GET" /> : null}
      <span>{val.title}</span>

      <Dropdown
        overlay={menu(val)}
        trigger={["click"]}
        visible={visible}
        onVisibleChange={handleVisibleChange}
      >
        <MoreOutlined onClick={(e) => e.stopPropagation()} />
      </Dropdown>
    </CollectionTitleWrapper>
  );
}

export default CollectionTitle;
