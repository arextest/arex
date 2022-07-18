import HttpRequest from "../components/http/Request";
import { useMount } from "ahooks";
import { RequestService } from "../services/RequestService";
import { useEffect, useState } from "react";

// 这个组件应和对比组件公用一种，id从上层获取

const RequestPage = ({ data }) => {
  const [request, setRequest] = useState({});
  useMount(() => {
    RequestService.retrieveARequest({ id: data.qid }).then((res) => {
      // console.log(res)
      setRequest(res.data.body);
    });
  });
  // useEffect(()=>{
  //
  // },[data])
  return (
    <div>
      {/*<p>{JSON.stringify(da.data)}</p>*/}
      {/*<p>{request?.address?.endpoint}</p>*/}
      <HttpRequest request={request}></HttpRequest>
    </div>
  );
};

export default RequestPage;
