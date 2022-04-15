import {get, post, request, serviceBaseApi} from "@/request/index";

export const querySummary = (data: Object) => {
  return request({
    url: `${serviceBaseApi}/report_api/dashboard/summary`,
    method: post,
    data
  })
};

export const queryAllAppId = () => {
  return request({
    url: `${serviceBaseApi}/report_api/dashboard/queryAllAppId`,
    method: post
  })
};

export const queryAllAppResults = (data: Object) => {
  return request({
    url: `${serviceBaseApi}/report_api/dashboard/allAppResults`,
    method: post,
    data
  })
};

export const queryAllAppDailyResults = (data: Object) => {
  return request({
    url: `${serviceBaseApi}/report_api/dashboard/allAppDailyResults`,
    method: post,
    data
  })
};
