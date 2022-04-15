import {request, post, serviceBaseApi, get} from "@/request/index";

export const queryDifferences = (data: Object) => {
  return request({
    url: `${serviceBaseApi}/report_api/report/queryDifferences`,
    method: post,
    data
  })
};

export const queryMsgShowByScene = (data: Object) => {
  return request({
    url: `${serviceBaseApi}/report_api/report/queryMsgShowByScene`,
    method: post,
    data
  })
};

export const addIgnoreConfig = (data: Object) => {
  return request({
    url: `${serviceBaseApi}/config_api/addCompareConfig`,
    method: post,
    data
  })
};

export const querySlaveOperations = (data: Object) => {
  return request({
    url: serviceBaseApi + '/report_api/report/queryResponseTypeStatistic',
    method: post,
    data
  })
};

export const queryScenes = (data: Object) => {
  return request({
    url: serviceBaseApi + '/report_api/report/queryScenes',
    method: post,
    data
  })
}

export const queryReplayCases = (data: Object) => {
  return request({
    url: serviceBaseApi + '/report_api/report/queryReplayCase',
    method: post,
    data
  })
}

export const queryReplayMsg = (data: Object) => {
  return request({
    url: serviceBaseApi + '/report_api/report/queryReplayMsg',
    method: post,
    data
  })
}

export const queryFullLinkMsg = (data: Object) => {
  return request({
    url: serviceBaseApi + '/report_api/report/queryFullLinkMsg',
    method: post,
    data
  })
}

export const queryMsgWithDiff = (data: Object) => {
  return request({
    url: serviceBaseApi + '/report_api/report/queryMsgWithDiff',
    method: post,
    data
  })
}

export const queryMsgSchema = (data: Object)=>{
  return request({
    url: serviceBaseApi + '/report_api/report/queryMsgSchema',
    method: post,
    data
  })
}

export const comparisonModifyInsert = (data: Object)=>{
  return request({
    url: `${serviceBaseApi}/config_api/config/comparison/modify/INSERT`,
    method: post,
    data
  })
}

export const comparisonModifyRemove = (data: Object)=>{
  return request({
    url: `${serviceBaseApi}/config_api/config/comparison/modify/REMOVE`,
    method: post,
    data
  })
}

export const comparisonUseResultAsList = (data: any) => {
  return request({
    url: `${serviceBaseApi}/config_api/config/comparison/useResultAsList/appId/${data.appId}`,
    method: get,
    data
  }).then((res:any)=>{
    if (res.length===0){
      return [{detailsList:[]}]
    } else {
      return res
    }
  })
}
