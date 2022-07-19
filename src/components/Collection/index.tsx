import {
  CaretDownOutlined,
  FolderOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useMount } from "ahooks";
import { Button, ButtonProps, Divider, Empty, Tabs, Tooltip, Tree } from "antd";
import type { DirectoryTreeProps } from "antd/lib/tree";
import React, { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import { FileSystemService } from "../../api/FileSystem.service";
import {
  collectionOriginalTreeToAntdTreeData,
  collectionTreeToArr,
} from "../../helpers/collection/util";
import { useStore } from "../../store";
import CollectionTitle from "./CollectionTitle";
import CreateAndUpdateFolder from "./CreateAndUpdateFolder";
import { Color } from "../../style/theme";
import styled from "@emotion/styled";

const { TabPane } = Tabs;
const CollectionTabs = styled(Tabs)`
  margin-top: -16px;
  .ant-tabs-nav {
    min-width: 32px !important;
  }
  .ant-tabs-tab {
    padding: 0 !important;
  }
  .ant-tabs-tabpane {
    padding-left: 8px !important;
  }
  .ant-tabs-nav-list {
    .ant-tabs-tab,
    .ant-tabs-ink-bar {
      height: 35px !important;
    }
  }
  .ant-tree-treenode,
  .ant-tree-node-content-wrapper {
    width: 228px;
  }
`;

const AddNewButton = styled((props: ButtonProps) => (
  <Button icon={<PlusCircleOutlined />} type="text" {...props} />
))`
  color: ${Color.primaryColor}!important;
  padding: 0 8px;
  margin: 4px 0 4px 9px;
  height: 26px;
`;

const Collection = ({ changeSelectedRequest }: any) => {
  const { t } = useTranslation("components");
  const currentWorkspaceId = useStore((state) => state.currentWorkspaceId);
  const collectionTree = useStore((state) => state.collectionTree);
  const httpPanes = useStore((state) => state.httpPanes);
  const httpActiveKey = useStore((state) => state.httpActiveKey);
  const setCollectionTree = useStore((state) => state.setCollectionTree);
  const setHttpPanes = useStore((state) => state.setHttpPanes);
  const setHttpActiveKey = useStore((state) => state.setHttpActiveKey);

  const collections = useMemo(() => {
    return collectionTreeToArr(collectionTree);
  }, [collectionTree]);

  const onExpand: DirectoryTreeProps["onExpand"] = (keys, info) => {};
  const onSelect: DirectoryTreeProps["onSelect"] = (keys, info) => {
    console.log(keys, "keys");
    const [key] = keys;
    const findHttpPanes = httpPanes.find((pane) => pane.key === key);
    console.log(findHttpPanes, "findHttpPanes");
    // 1.数组里没有
    if (!findHttpPanes) {
      const copyHttpPanes = JSON.parse(JSON.stringify(httpPanes));
      if (collections.find((i) => i.key === key).nodeType !== 3) {
        copyHttpPanes.push({
          title: collections.find((i) => i.key === key).title,
          key,
          nodeType: collections.find((i) => i.key === key).type,
          isNew: false,
        });
        setHttpPanes(copyHttpPanes);
        setHttpActiveKey(key);
      }
    } else {
      setHttpActiveKey(key);
    }
  };

  useMount(() => {
    fetchDirectoryTreeData();
  });

  useEffect(() => {
    fetchDirectoryTreeData();
  }, [currentWorkspaceId]);

  function handleAddItem() {
    FileSystemService.addItem({
      id: "62b3fc610c4d613355bd2b5b",
      nodeName: "New Collection",
      nodeType: 3,
      parentPath: [],
      userName: "zt",
    }).then(() => {
      fetchDirectoryTreeData();
    });
  }

  function fetchDirectoryTreeData() {
    FileSystemService.queryWorkspaceById({ id: currentWorkspaceId }).then(
      (res) => {
        const roots = res?.body?.fsTree?.roots || [];
        setCollectionTree(collectionOriginalTreeToAntdTreeData(roots));
      }
    );
  }

  return (
    <CollectionTabs defaultActiveKey="2" tabPosition={"left"}>
      <TabPane
        tab={
          <Tooltip title={t("collectionMenu.collection")}>
            <FolderOutlined />
          </Tooltip>
        }
        key="2"
      >
        <AddNewButton onClick={handleAddItem}>
          {t("collectionMenu.newCreate")}
        </AddNewButton>

        <Divider style={{ margin: "0 0 8px 0" }} />

        {collectionTree.length > 0 ? (
          <Tree
            showLine
            switcherIcon={<CaretDownOutlined />}
            onSelect={onSelect}
            onExpand={onExpand}
            treeData={collectionTree}
            titleRender={(val) => (
              <CollectionTitle
                updateDirectoryTreeData={fetchDirectoryTreeData}
                val={val}
              />
            )}
          />
        ) : (
          <Empty
            style={{ display: collectionTree.length > 0 ? "none" : "block" }}
          >
            <Button
              type="primary"
              onClick={() => {
                FileSystemService.addItem({
                  id: "62b3fc610c4d613355bd2b5b",
                  nodeName: "New Collection",
                  nodeType: 3,
                  parentPath: [],
                  userName: "zt",
                }).then(() => {
                  fetchDirectoryTreeData();
                });
              }}
            >
              {t("collectionMenu.newCreate")}
            </Button>
          </Empty>
        )}

        <CreateAndUpdateFolder
          updateDirectoryTreeData={fetchDirectoryTreeData}
        />
      </TabPane>
    </CollectionTabs>
  );
};

export default Collection;
