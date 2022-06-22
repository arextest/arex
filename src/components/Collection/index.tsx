import { useMount } from "ahooks";
import {Badge, Button, Divider, Dropdown, Empty, Input, List, Menu, Space, Tabs, Tree} from "antd";
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


const onChange = (key: string) => {
  console.log(key);
};

const { DirectoryTree } = Tree;



const Collection = ({changeSelectedRequest}) => {
  const { t } = useTranslation("components");
  const [treeData, setTreeData] = useState([]);
  const currentWorkspaceId = useStore((state) => state.currentWorkspaceId);
  const onSelect: DirectoryTreeProps["onSelect"] = (keys, info) => {
    console.log("Trigger Select", keys, info);
  };

  const [currentSelectLeaf, setCurrentSelectLeaf] = useState('');
  const [currentSelectPath, setCurrentSelectPath] = useState([]);

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
          {
            key: '5',
            label: (
              <a target="_blank" rel="noopener noreferrer" onClick={()=>{
                createAndUpdateFolderRef.current.changeVal({path:findPathbyKey(treeData,key),mode:'createRequest'})
              }}>
                新增请求
              </a>
            )
          },
        ]}
      />
    )
  };

  function TitleRender({val}) {

    return <div className={'title-render'}>
      <div className={'wrap'}>
        <div className={'title'} onClick={()=>{
          console.log(val,'val',findPathbyKey(treeData,val.key))
          if (val.isLeaf){

            changeSelectedRequest({
              id:val.key,
              path:findPathbyKey(treeData,val.key)
            })

            setCurrentSelectLeaf(val.key)
            setCurrentSelectPath(findPathbyKey(treeData,val.key))
            FileSystemService.queryInterface({id:val.key}).then(res=>{
              console.log(res)
            })
          }

        }}><div className={'ellipsis'}>{val.title}</div>{currentSelectLeaf === val.key?<Badge style={{marginLeft:'8px'}} status="processing" />:null}</div>
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
            isLeaf:nodes[value].nodeType !==3,
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
          {/*<Input.Search style={{width:'80px'}}></Input.Search>*/}
          <a className={'new-btn'} onClick={()=>{createAndUpdateFolderRef.current.changeVal({path:[],mode:'create'})}}>+<span style={{marginLeft:'8px'}}>新增</span></a>
          <Divider/>
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
            <Button type="primary" onClick={()=>{createAndUpdateFolderRef.current.changeVal({path:[],mode:'create'})}}>Create Now</Button>
          </Empty>
          {/*<p>{currentSelectPath.join('/')}</p>*/}
        </TabPane>
        <TabPane tab={t("collectionMenu.environment")} key="3" disabled>
          <List
            itemLayout="horizontal"
            dataSource={[]}
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
