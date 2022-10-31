import axios from 'axios';

import request from '../helpers/api/axios';
import { tryPrettierJsonString } from '../helpers/utils';
import {
  CreatePlanReq,
  CreatePlanRes,
  QueryDifferencesReq,
  QueryDifferencesRes,
  QueryFullLinkMsgReq,
  QueryFullLinkMsgRes,
  QueryMsgWithDiffReq,
  QueryMsgWithDiffRes,
  QueryPlanItemStatisticsReq,
  QueryPlanItemStatisticsRes,
  QueryPlanStatisticsReq,
  QueryPlanStatisticsRes,
  QueryReplayCaseReq,
  QueryReplayCaseRes,
  QueryResponseTypeStatisticReq,
  QueryResponseTypeStatisticRes,
  QueryScenesReq,
  QueryScenesRes,
  RegressionListRes,
} from './Replay.type';

export default class ReplayService {
  static async regressionList() {
    return request
      .get<RegressionListRes>('/config/application/regressionList')
      .then((res) => Promise.resolve(res.body.map((item) => item.application)));
  }

  static async queryPlanStatistics(params: QueryPlanStatisticsReq) {
    return request
      .post<QueryPlanStatisticsRes>('/report/queryPlanStatistics', params)
      .then((res) =>
        Promise.resolve(
          res.body.planStatisticList.sort((a, b) => b.replayStartTime - a.replayStartTime),
        ),
      );
  }

  static async queryPlanItemStatistics(params: QueryPlanItemStatisticsReq) {
    return request
      .post<QueryPlanItemStatisticsRes>('/report/queryPlanItemStatistics', params)
      .then((res) => Promise.resolve(res.body.planItemStatisticList));
  }

  static async queryResponseTypeStatistic(params: QueryResponseTypeStatisticReq) {
    return request
      .post<QueryResponseTypeStatisticRes>('/report/queryResponseTypeStatistic', params)
      .then((res) => Promise.resolve(res.body.categoryStatisticList || []));
  }

  static async queryDifferences(params: QueryDifferencesReq) {
    return request
      .post<QueryDifferencesRes>('/report/queryDifferences', params)
      .then((res) => Promise.resolve(res.body.differences));
  }

  static async queryReplayCase({
    planItemId,
    needTotal = false,
    pageIndex = 1,
    pageSize = 99,
  }: QueryReplayCaseReq) {
    return request
      .post<QueryReplayCaseRes>('/report/queryReplayCase', {
        needTotal,
        pageIndex,
        pageSize,
        planItemId,
      })
      .then((res) => Promise.resolve(res.body.result));
  }

  static async createPlan(params: CreatePlanReq) {
    return new Promise<CreatePlanRes>((resolve, reject) => {
      return axios
        .post<any, { data: CreatePlanRes }>('/schedule/createPlan', params)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }

  static async queryScenes(params: QueryScenesReq) {
    return request
      .post<QueryScenesRes>('/report/queryScenes', params)
      .then((res) => Promise.resolve(res.body.scenes));
  }

  static async queryMsgWithDiff(params: QueryMsgWithDiffReq) {
    return request
      .post<QueryMsgWithDiffRes>('/report/queryMsgWithDiff', params)
      .then((res) => Promise.resolve(res.body));
  }

  static async queryFullLinkMsg(params: QueryFullLinkMsgReq) {
    return request.post<QueryFullLinkMsgRes>('/report/queryFullLinkMsg', params).then((res) =>
      Promise.resolve(
        res.body.compareResults.map((item) => {
          const type: 'html' | 'json' = item.baseMsg?.includes('<html>') ? 'html' : 'json';
          return {
            ...item,
            baseMsg: item.baseMsg
              ? type === 'html'
                ? item.baseMsg
                : tryPrettierJsonString(item.baseMsg)
              : '',
            testMsg: item.testMsg
              ? type === 'html'
                ? item.testMsg
                : tryPrettierJsonString(item.testMsg)
              : '',
            type,
          };
        }),
      ),
    );
  }
}
