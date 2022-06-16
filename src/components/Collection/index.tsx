import { Tabs, Avatar, List } from "antd";
const { TabPane } = Tabs;
import { Tree } from "antd";
import type { DataNode, DirectoryTreeProps } from "antd/lib/tree";
import React from "react";

const data = [
  {
    title: "Ant Design Title 1",
  },
  {
    title: "Ant Design Title 2",
  },
  {
    title: "Ant Design Title 3",
  },
  {
    title: "Ant Design Title 4",
  },
];

const onChange = (key: string) => {
  console.log(key);
};

const { DirectoryTree } = Tree;

const treeData: DataNode[] = [
  {
    title: "user",
    key: "0-0",
    children: [{ title: "获取个人信息", key: "0-0-0", isLeaf: true }],
  },
  {
    title: "repo",
    key: "0-1",
    children: [
      { title: "列出仓库", key: "0-1-0", isLeaf: true },
      { title: "获取单个仓库概览", key: "0-1-1", isLeaf: true },
    ],
  },
];
const Collection = () => {
  const onSelect: DirectoryTreeProps["onSelect"] = (keys, info) => {
    console.log("Trigger Select", keys, info);
  };

  const onExpand: DirectoryTreeProps["onExpand"] = (keys, info) => {
    console.log("Trigger Expand", keys, info);
  };
  return <div>
    <Tabs defaultActiveKey="2" onChange={onChange} tabPosition={'left'}>
      <TabPane tab="集合" key="2">

        <DirectoryTree
          multiple
          defaultExpandAll
          onSelect={onSelect}
          onExpand={onExpand}
          treeData={treeData}
        />

      </TabPane>
      <TabPane tab="环境" key="3">
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={<a href="https://ant.design">{item.title}</a>}
              />
            </List.Item>
          )}
        />
      </TabPane>
    </Tabs>
  </div>;
};

export default Collection;
