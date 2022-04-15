import {get, post, request, serviceBaseApi} from "@/request/index";

export const queryRecordConfiguration = (appId: string) => {
  return request({
    url: `${serviceBaseApi}/config_api/config/serviceCollect/useResult/appId/${appId}`,
    method: get,
  })
};

export const queryDynamicClasses = (appId: string) => {
  return request({
    url: `${serviceBaseApi}/config_api/config/dynamicClass/useResultAsList/appId/${appId}`,
    method: get,
  })
};

export const addDynamicClass = (data: object) => {
  return request({
    url: `${serviceBaseApi}/config_api/config/dynamicClass/modify/INSERT`,
    method: post,
    data
  })
};

export const deleteDynamicClass = (data: object) => {
  return request({
    url: `${serviceBaseApi}/config_api/config/dynamicClass/modify/REMOVE`,
    method: post,
    data
  })
};

export const queryReplayConfiguration = (appId: string) => {
  return request({
    url: `${serviceBaseApi}/config_api/config/schedule/useResult/appId/${appId}`,
    method: get,
  })
};

export const queryComparisonConfiguration = (appId: string) => {
  return request({
    url: `${serviceBaseApi}/config_api/config/comparison/editList/appId/${appId}`,
    method: get,
  })
};

export const queryAppServices = (appId: string) => {
  return request({
    url: `${serviceBaseApi}/config_api/config/applicationService/useResultAsList/appId/${appId}`,
    method: get,
  })
};

export const updateReplayConfiguration = (data: object) => {
  return request({
    url: `${serviceBaseApi}/config_api/config/schedule/modify/UPDATE`,
    method: post,
    data
  })
};

export const updateRecordConfiguration = (data: object) => {
  return request({
    url: `${serviceBaseApi}/config_api/config/serviceCollect/modify/UPDATE`,
    method: post,
    data
  })
};


export const querySchema = (data: object) => {
  return request({
    url: `${serviceBaseApi}/report_api/report/querySchemaForConfig`,
    method: post,
    data
  })
};

export const queryChildSchema = (data: object) => {
  return request({
    url: `${serviceBaseApi}/report_api/report/queryMsgSchema`,
    method: post,
    data
  })
};

export const addComparisonConfigurationItem = (data: object) => {
  return request({
    url: `${serviceBaseApi}/config_api/config/comparison/modify/INSERT`,
    method: post,
    data
  })
};

export const deleteComparisonConfigurationItem = (data: object) => {
  return request({
    url: `${serviceBaseApi}/config_api/config/comparison/modify/REMOVE`,
    method: post,
    data
  })
};

export const addConfigTemplate = (data: object) => {
  return request({
    url: `${serviceBaseApi}/report_api/config/pushConfigTemplate`,
    method: post,
    data
  })
};

export const queryConfigTemplate = (data: object) => {
  return request({
    url: `${serviceBaseApi}/report_api/config/queryConfigTemplate`,
    method: post,
    data
  })
};


