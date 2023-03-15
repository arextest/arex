import axios from 'axios';

import request from '../helpers/api/axios';
import { tryPrettierJsonString } from '../helpers/utils';
import {
  CreatePlanReq,
  CreatePlanRes,
  QueryDifferencesReq,
  QueryDifferencesRes,
  QueryDiffMsgByIdReq,
  QueryDiffMsgByIdRes,
  QueryFullLinkInfoReq,
  QueryFullLinkInfoRes,
  QueryFullLinkMsgReq,
  QueryFullLinkMsgRes,
  QueryMsgWithDiffRes,
  QueryPlanItemStatisticsReq,
  QueryPlanItemStatisticsRes,
  QueryPlanStatisticsReq,
  QueryPlanStatisticsRes,
  QueryReplayCaseReq,
  QueryReplayCaseRes,
  QueryResponseTypeStatisticReq,
  QueryResponseTypeStatisticRes,
  QuerySceneInfoReq,
  QuerySceneInfoRes,
  QueryScenesReq,
  QueryScenesRes,
  RegressionListRes,
} from './Replay.type';

export default class ReplayService {
  static async regressionList() {
    return request
      .get<RegressionListRes>('/report/config/application/regressionList')
      .then((res) => Promise.resolve(res.body.map((item) => item.application)));
  }

  static async queryPlanStatistics(params: QueryPlanStatisticsReq) {
    return request
      .post<QueryPlanStatisticsRes>('/report/report/queryPlanStatistics', params)
      .then((res) =>
        Promise.resolve(
          res.body.planStatisticList.sort((a, b) => b.replayStartTime - a.replayStartTime),
        ),
      );
  }

  static async terminatePlanStatistics(planId: string) {
    return new Promise<{
      result: number;
      desc: string;
    }>((resolve, reject) => {
      return axios
        .get('/schedule/stopPlan?planId=' + planId)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }

  static async deletePlanStatistics(planId: string) {
    const res = await request.get<boolean>('/report/report/delete/' + planId);
    return res.body;
  }

  static async queryPlanItemStatistics(params: QueryPlanItemStatisticsReq) {
    return request
      .post<QueryPlanItemStatisticsRes>('/report/report/queryPlanItemStatistics', params)
      .then((res) => Promise.resolve(res.body.planItemStatisticList));
  }

  static async queryResponseTypeStatistic(params: QueryResponseTypeStatisticReq) {
    return request
      .post<QueryResponseTypeStatisticRes>('/report/report/queryResponseTypeStatistic', params)
      .then((res) => Promise.resolve(res.body.categoryStatisticList || []));
  }

  static async queryDifferences(params: QueryDifferencesReq) {
    return request
      .post<QueryDifferencesRes>('/report/report/queryDifferences', params)
      .then((res) => Promise.resolve(res.body.differences));
  }

  static async queryReplayCase({
    planItemId,
    needTotal = false,
    pageIndex = 1,
    pageSize = 99,
  }: QueryReplayCaseReq) {
    return request
      .post<QueryReplayCaseRes>('/report/report/queryReplayCase', {
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
      .post<QueryScenesRes>('/report/report/queryScenes', params)
      .then((res) => Promise.resolve(res.body.scenes));
  }

  static async queryMsgWithDiff(params: { logIndexes: string; compareResultId: string }) {
    return request
      .post<QueryMsgWithDiffRes>('/report/report/queryMsgWithDiff', params)
      .then((res) => Promise.resolve(res.body));
  }

  static async queryFullLinkMsg(params: QueryFullLinkMsgReq) {
    return request
      .post<QueryFullLinkMsgRes>('/report/report/queryFullLinkMsg', params)
      .then((res) =>
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

  static async querySceneInfo(params: QuerySceneInfoReq) {
    return request
      .get<QuerySceneInfoRes>(`/report/report/querySceneInfo/${params.planId}/${params.planItemId}`)
      .then((res) => Promise.resolve(res.body.sceneInfos.filter((scene) => scene.subScenes))); //  subScenes could be null;
  }

  static async queryFullLinkInfo(params: QueryFullLinkInfoReq) {
    return request
      .get<QueryFullLinkInfoRes>(
        `/report/report/queryFullLinkInfo/${params.recordId}/${params.replayId}`,
      )
      .then((res) => Promise.resolve(res.body));
  }

  static async queryDiffMsgById(params: QueryDiffMsgByIdReq) {
    return request
      .get<QueryDiffMsgByIdRes>(`/report/report/queryDiffMsgById/${params.id}`)
      .then((res) => Promise.resolve(res.body.compareResultDetail));
  }
}
