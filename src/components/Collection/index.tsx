import { Button, Spin, Input, Tooltip, Tree, Empty } from "antd";
import { MenuOutlined, DashOutlined, DownOutlined } from "@ant-design/icons";
import React, { FC, useEffect, useMemo, useState } from "react";
import "./index.less";
import { CollectionService } from "../../services/CollectionService";
import CollectionTitleRender from "./CollectionTitleRender"; 
import { collectionOriginalTreeToAntdTreeData } from "../../helpers/collection/util";
import type { DirectoryTreeProps } from "antd/lib/tree";
import type { DataNode } from "antd/es/tree";
import { useMount } from "ahooks";
import { useNavigate, useParams } from "react-router-dom";
const { Search } = Input;

const dataList: { key: React.Key; title: string }[] = [];
const generateList = (data: DataNode[]) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key, title }: any = node;
    dataList.push({ key, title });
    if (node.children) {
      generateList(node.children);
    }
  }
};

const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
  let parentKey: React.Key;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey!;
};

type Props = {
  treeData: any;
  fetchTreeData: () => void;
  loading: boolean;
  setMainBoxPanes: (p: any) => void;
  mainBoxPanes: any[];
  setMainBoxActiveKey: (p: any) => void;
};

const Collection: FC<Props> = (
  {
    treeData,
    fetchTreeData,
    loading,
    setMainBoxPanes,
    mainBoxPanes,
    setMainBoxActiveKey,
  },
) => {
  const _useParams = useParams();
  const _useNavigate = useNavigate();
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const onExpand: any = (newExpandedKeys: string[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const onSelect: DirectoryTreeProps["onSelect"] = (keys, info) => {
    if (
      keys[0] &&
      info.node.nodeType !== 3 &&
      !mainBoxPanes.map((i) => i.key).includes(keys[0])
    ) {
      // const newActiveKey = String(Math.random());
      const newPanes = [...mainBoxPanes];
      newPanes.push({
        closable: true,
        title: info.node.title,
        key: keys[0],
        pageType: "request",
        qid: keys[0],
        //
        // 其实nodeType应该得通过qid拿到
        nodeType: info.node.nodeType,
      });
      // setPanes(newPanes);
      setMainBoxPanes(newPanes);
    }
    if (keys[0]) {
      setMainBoxActiveKey(keys[0]);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    let newExpandedKeys;
    if (value == "") {
      newExpandedKeys = dataList.map((item) => item.title);
    } else {
      newExpandedKeys = dataList.map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, treeData);
        }
        return null;
      }).filter((item, i, self) => item && self.indexOf(item) === i);
    }
    setExpandedKeys(newExpandedKeys as React.Key[]);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  useEffect(() => {
    generateList(treeData);
  }, [treeData]);

  return (
    <div className={"collection"}>
      <div className={"collection-header"}>
        <Tooltip
          placement="bottomLeft"
          title={"Create New"}
          mouseEnterDelay={0.5}
        >
          <Button
            className={"collection-header-create"}
            type="text"
            size="small"
            onClick={() => {
              CollectionService.addItem({
                id: _useParams.workspaceId,
                nodeName: "New Collection",
                nodeType: 3,
                parentPath: [],
                userName: "zt",
              }).then(() => {
                fetchTreeData();
              });
            }}
          >
            +
          </Button>
        </Tooltip>
        <Input
          className={"collection-header-search"}
          size="small"
          placeholder=""
          prefix={<MenuOutlined />}
          onChange={onChange}
        />
        <Tooltip
          placement="bottomLeft"
          title={"View more actions"}
          mouseEnterDelay={0.5}
        >
          <Button className={"collection-header-view"} type="text" size="small">
            <DashOutlined />
          </Button>
        </Tooltip>
      </div>
      <Tree
        onExpand={onExpand}
        onSelect={onSelect}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        // showLine
        switcherIcon={<DownOutlined />}
        treeData={treeData}
        titleRender={(val) => (
          <CollectionTitleRender
            updateDirectorytreeData={() => {
              fetchTreeData();
            }}
            val={val}
            treeData={treeData}
          />
        )}
      />
      <Empty style={{ display: treeData.length > 0 ? "none" : "block" }}>
        <Button
          type="primary"
          onClick={() => {
            CollectionService.addItem({
              id: _useParams.workspaceId,
              nodeName: "New Collection",
              nodeType: 3,
              parentPath: [],
              userName: "zt",
            }).then(() => {
              fetchTreeData();
            });
          }}
        >
          New
        </Button>
      </Empty>
    </div>
  );
};

export default Collection;
