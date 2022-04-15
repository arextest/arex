import {get, post, request, serviceBaseApi} from "@/request/index";

export const queryApps = (params?: Object) => {
  return request({
    url: `${serviceBaseApi}/config_api/config/application/regressionList`,
    method: get,
    params
  })
};

export const queryEnvs = (data: Object) => {
  return request({
    url: `${serviceBaseApi}/config_api/getFatServiceInstance`,
    method: post,
    data
  })
};

export const addPlan = (data: Object) => {
  return request({
    url: `${serviceBaseApi}/schedule_api/createPlan`,
    method: post,
    data
  })
};
