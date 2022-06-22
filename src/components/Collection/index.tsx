import { useMount } from "ahooks";
import {Button, Dropdown, Empty, List, Menu, Space, Tabs, Tree} from "antd";
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
            key: '2',
            label: (
              <a target="_blank" rel="noopener noreferrer" onClick={()=>{
                createAndUpdateFolderRef.current.changeVal({path:findPathbyKey(treeData,key),mode:'create'})
              }}>
                新增文件夹
              </a>
            )
          },
          {
            key: '1',
            label: (
              <a target="_blank" rel="noopener noreferrer" onClick={()=>{
                createAndUpdateFolderRef.current.changeVal({path:findPathbyKey(treeData,key),mode:'update'})
              }}>
                重命名
              </a>
            )
          },
          {
            key: '3',
            label: (
                <a style={{color:'red'}} onClick={()=>{
                  FileSystemService.removeItem({
                    id:currentWorkspaceId,
                    removeNodePath:findPathbyKey(treeData,key).join('.')
                  }).then(res=>{

                    fetchWorkspaceData()
                  })
                }}>
                  删除
                </a>
            ),
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
            <MoreOutlined/>
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
          <Empty style={{display:treeData.length>0?'none':'block'}}>
            <Button type="primary" onClick={()=>{createAndUpdateFolderRef.current.changeVal({path:[]})}}>Create Now</Button>
          </Empty>
        </TabPane>
        <TabPane tab={t("collectionMenu.environment")} key="3" disabled>
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
      <CreateAndUpdateFolder ref={createAndUpdateFolderRef} reFe={()=>{fetchWorkspaceData()}}></CreateAndUpdateFolder>
    </div>
  );
};

export default Collection;
