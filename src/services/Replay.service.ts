import axios from 'axios';

import request from '../api/axios';
import { tryPrettierJsonString } from '../utils';
import {
  CreatePlanReq,
  CreatePlanRes,
  PushConfigTemplateReq,
  PushConfigTemplateRes,
  QueryConfigTemplateReq,
  QueryConfigTemplateRes,
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
  QueryRecordDynamicClassSettingReq,
  QueryRecordDynamicClassSettingRes,
  QueryRecordSettingReq,
  QueryRecordSettingRes,
  QueryReplayCaseReq,
  QueryReplayCaseRes,
  QueryResponseTypeStatisticReq,
  QueryResponseTypeStatisticRes,
  QueryScenesReq,
  QueryScenesRes,
  queryScheduleUseResultAppIdRes,
  RegressionListRes,
  RemoveDynamicClassSettingReq,
  RemoveDynamicClassSettingRes,
  UpdateDynamicClassSettingReq,
  UpdateDynamicClassSettingRes,
  UpdateRecordSettingReq,
  UpdateRecordSettingRes,
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
          const type: 'html' | 'json' = item.baseMsg.includes('<html>') ? 'html' : 'json';
          return {
            ...item,
            baseMsg: type === 'html' ? item.baseMsg : tryPrettierJsonString(item.baseMsg),
            testMsg: type === 'html' ? item.testMsg : tryPrettierJsonString(item.testMsg),
            type,
          };
        }),
      ),
    );
    //  TODO parsing msg
  }

  // 获取 Replay - record 设置数据
  static async queryRecordSetting(params: QueryRecordSettingReq) {
    return request
      .get<QueryRecordSettingRes>('/config/serviceCollect/useResult/appId/' + params.id)
      .then((res) => Promise.resolve(res.body));
  }

  // 更新 Replay - record 设置数据
  static async updateRecordSetting(params: UpdateRecordSettingReq) {
    return request
      .post<UpdateRecordSettingRes>('/config/serviceCollect/modify/UPDATE', params)
      .then((res) => Promise.resolve(res.body));
  }

  // 获取 Replay - record Dynamic Classes 设置数据
  static async queryRecordDynamicClassSetting(params: QueryRecordDynamicClassSettingReq) {
    return request
      .get<QueryRecordDynamicClassSettingRes | undefined>(
        '/config/dynamicClass/useResultAsList/appId/' + params.appId,
      )
      .then((res) => Promise.resolve(res.body));
  }

  // 添加 Replay - record Dynamic Classes 设置数据
  static async updatedDynamicClassSetting(params: UpdateDynamicClassSettingReq) {
    return request
      .post<UpdateDynamicClassSettingRes>('/config/dynamicClass/modify/INSERT', params)
      .then((res) => Promise.resolve(res.body));
  }

  // 删除 Replay - record Dynamic Classes 设置数据
  static async removeDynamicClassSetting(params: RemoveDynamicClassSettingReq) {
    return request
      .post<RemoveDynamicClassSettingRes>('/config/dynamicClass/modify/REMOVE', params)
      .then((res) => Promise.resolve(res.body));
  }

  static async queryConfigTemplate(params: QueryConfigTemplateReq) {
    return request
      .post<QueryConfigTemplateRes>('/api/config/queryConfigTemplate', params)
      .then((res) => Promise.resolve(res.body));
  }

  static async pushConfigTemplate(params: PushConfigTemplateReq) {
    return request
      .post<PushConfigTemplateRes>('/api/config/pushConfigTemplate', params)
      .then((res) => Promise.resolve(res.body));
  }

  static async queryScheduleUseResultAppId(params: { id: string }) {
    return request
      .get<queryScheduleUseResultAppIdRes>('/config/schedule/useResult/appId/' + params.id)
      .then((res) => Promise.resolve(res.body));
  }
  static async configScheduleModifyUpdate(params) {
    return request
      .post<any>('/config/schedule/modify/UPDATE', params)
      .then((res) => Promise.resolve(res.body));
  }
}
