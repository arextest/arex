import {Button, Spin} from "antd";
import {FC} from "react";
import './index.less'


type Props = {
  fetchData: ()=>void;
  loading:boolean;
  treeData:any[]
};
const Collection:FC<Props> = ({fetchData,loading,treeData}) => {
  return <div className={"collection"}>
    <Spin spinning={loading}>
      <p>{JSON.stringify(treeData)}</p>
    </Spin>
    <Button onClick={()=>{
      fetchData()
    }}>更新</Button>
  </div>;
};

export default Collection;
