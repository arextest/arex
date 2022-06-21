import { useMount } from "ahooks";
import {Dropdown, List, Menu, Space, Tabs, Tree} from "antd";
import type { DirectoryTreeProps } from "antd/lib/tree";
import React, {useEffect, useRef, useState} from "react";
import { useTranslation } from "react-i18next";

import { FileSystemService } from "../../api/FileSystemService";
import {useStore} from "../../store";
import './index.less'
import {DownOutlined, MoreOutlined, SmileOutlined} from "@ant-design/icons";
import CreateAndUpdateFolder from "./CreateAndUpdateFolder";

function findPathbyKey(tree,key,path){
  if(typeof path=='undefined'){
    path=[]
  }
  for(var i=0;i<tree.length;i++){
    var tempPath=[...path]
    tempPath.push(tree[i].title)
    if(tree[i].key==key){
      return tempPath
    }
    if(tree[i].children){
      let reuslt=findPathbyKey(tree[i].children,key,tempPath)
      if(reuslt){
        return reuslt
      }
    }
  }
}

const { TabPane } = Tabs;

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



const Collection = () => {
  const { t } = useTranslation("components");
  const [treeData, setTreeData] = useState([]);
  const currentWorkspaceId = useStore((state) => state.currentWorkspaceId);
  const onSelect: DirectoryTreeProps["onSelect"] = (keys, info) => {
    console.log("Trigger Select", keys, info);
  };

  const createAndUpdateFolderRef = useRef();

  const onExpand: DirectoryTreeProps["onExpand"] = (keys, info) => {
    console.log("Trigger Expand", keys, info);

    console.log(findPathbyKey(treeData,'asfasfas'))
  };


  useMount(() => {
    fetchWorkspaceData()
  });

  useEffect(()=>{
    fetchWorkspaceData()
  },[currentWorkspaceId])

  const menu = (key)=>{
    return (
      <Menu
        items={[
          {
            key: '1',
            label: (
              <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                新增请求
              </a>
            ),
          },
          {
            key: '2',
            label: (
              <a target="_blank" rel="noopener noreferrer" onClick={()=>{
                createAndUpdateFolderRef.current.changeVal({path:findPathbyKey(treeData,key)})
              }}>
                新增文件夹
              </a>
            ),
            icon: <SmileOutlined />,
          },
        ]}
      />
    )
  };

  function TitleRender({val}) {

    return <div className={'title-render'}>
      <div className={'wrap'}>
        <div>{val.title}</div>
        <Dropdown overlay={menu(val.key)} trigger={['click']}>
        <span onClick={event => event.stopPropagation()}>
          <Space>
            <MoreOutlined />
          </Space>
        </span>
        </Dropdown>
      </div>
    </div>
  }

  function fetchWorkspaceData() {
    FileSystemService.queryWorkspaceById({id:currentWorkspaceId}).then((res) => {
      function dg(nodes, nodeList = []) {
        Object.keys(nodes).forEach((value, index, array) => {
          nodeList.push({
            title: nodes[value].nodeName,
            key: nodes[value].infoId,
            children: [],
          });
          if (
            nodes[value].children &&
            Object.keys(nodes[value].children).length > 0
          ) {
            dg(nodes[value].children, nodeList[index].children);
          }
        });

        return nodeList;
      }
      try {
        setTreeData(dg(res.body.fsTree.roots));
      } catch (e) {

      }
    });
  }

  return (
    <div className={'collection'}>
      <Tabs defaultActiveKey="2" onChange={onChange} tabPosition={"left"}>
        <TabPane tab={t("collectionMenu.collection")} key="2">
          <DirectoryTree
            selectable={false}
            multiple
            defaultExpandAll
            onSelect={onSelect}
            onExpand={onExpand}
            treeData={treeData}
            titleRender={(val)=><TitleRender val={val}></TitleRender>}
          />
        </TabPane>
        <TabPane tab={t("collectionMenu.environment")} key="3">
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={<a href="https://ant.design">{item.title}</a>}
                />
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>
      <CreateAndUpdateFolder ref={createAndUpdateFolderRef}></CreateAndUpdateFolder>
    </div>
  );
};

export default Collection;
