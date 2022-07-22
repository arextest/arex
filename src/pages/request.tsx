import HttpRequest from "../components/Http/index";
import { useMount } from "ahooks";
import { useEffect, useState } from "react";
import { treeFindPath } from "../helpers/collection/util";

const RequestPage = (
  { data, collectionTreeData, activateNewRequestInPane },
) => {
  const [request, setRequest] = useState({});
  useMount(() => {});
  return (
    <div>
      {/*依赖path，要替换掉*/}
      <HttpRequest
        collectionTreeData={collectionTreeData}
        mode={"normal"}
        id={data.qid}
        isNew={data.isNew}
        pageType={data.pageType}
        activateNewRequestInPane={(p)=>activateNewRequestInPane(p)}
      />
    </div>
  );
};

export default RequestPage;
