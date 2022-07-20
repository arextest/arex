import HttpRequest from "../components/http/index";
import { useMount } from "ahooks";
import { RequestService } from "../services/RequestService";
import { useEffect, useState } from "react";
import { findPathByKey } from "../components/collection/util";

// 这个组件应和对比组件公用一种，id从上层获取
const RequestPage = ({ data, collectionTreeData,activateNewRequestInPane }) => {
  const [request, setRequest] = useState({});
  useMount(() => {});
  return (
    <div>
      {/*依赖path，要替换掉*/}
      <HttpRequest
        collectionTreeData={collectionTreeData}
        mode={"normal"}
        id={data.qid}
        path={findPathByKey(collectionTreeData, data.qid)}
        isNew={false}
        activateNewRequestInPane={(p)=>activateNewRequestInPane(p)}
      />
    </div>
  );
};

export default RequestPage;
