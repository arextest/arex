import { Button, Spin, Input, Tooltip, Tree } from "antd";
import { MenuOutlined, DashOutlined } from '@ant-design/icons';
import {FC} from "react";
import './index.less'


type Props = {
  fetchData: ()=>void;
  loading:boolean;
  treeData:any[]
};
const Collection:FC<Props> = ({fetchData,loading,treeData}) => {

  // const onExpand: DirectoryTreeProps["onExpand"] = (keys, info) => {};
  // const onSelect: DirectoryTreeProps["onSelect"] = (keys, info) => {
  //   console.log(keys, 'keys')
  //   const [key] = keys
  //   const findHttpPanes = httpPanes.find(pane => pane.key === key)
  //   console.log(findHttpPanes, 'findHttpPanes')
  //   // 1.数组里没有
  //   if (!findHttpPanes) {
  //     const copyHttpPanes = JSON.parse(JSON.stringify(httpPanes))
  //     if (collections.find(i => i.key === key).nodeType !== 3) {
  //       copyHttpPanes.push({ title: collections.find(i => i.key === key).title, key, nodeType: collections.find(i => i.key === key).type, isNew: false })
  //       setHttpPanes(copyHttpPanes)
  //       setHttpActiveKey(key)
  //     }
  //   } else {
  //     setHttpActiveKey(key)
  //   }
  // };
  return (
    <div className={"collection"}>
      <div className={"collection-header"}>
        <Tooltip placement="bottomLeft" title={"Create New"} mouseEnterDelay={0.5}>
          <Button className={"collection-header-create"} type="text">+</Button>
        </Tooltip >
        <Input className={"collection-header-search"} size="middle" placeholder="" prefix={<MenuOutlined />} />
        <Tooltip placement="bottomLeft" title={"View more actions"} mouseEnterDelay={0.5}>
          <Button className={"collection-header-create"} type="text"><DashOutlined /></Button>
        </Tooltip >
        
      </div>
      <Tree
            style={{ padding: '0 12px', display: 'block' }}
            showLine={true}
            // onSelect={onSelect}
            // onExpand={onExpand}
            // treeData={collectionTree}
            // titleRender={(val) => <CollectionTitleRender updateDirectorytreeData={fetchDirectoryTreeData} val={val} />}
          />



      <Spin spinning={loading}>
        <p>{JSON.stringify(treeData)}</p>
      </Spin>
      <Button onClick={()=>{
        console.log(treeData);
        
        fetchData()
      }}>更新</Button>
    </div>
  )
};

export default Collection;
