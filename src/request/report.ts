import {post, request, serviceBaseApi} from "@/request/index";

export const queryPlan = (data: Object) => {
  return request({
    url: `${serviceBaseApi}/report_api/report/queryPlanStatistics`,
    method: post,
    data
  })
};

export const queryPlanItems = (data: Object) => {
  return request({
    url: `${serviceBaseApi}/report_api/report/queryPlanItemStatistics`,
    method: post,
    data
  })
};
