import request from "./axios";
import {
  QueryDifferencesReq,
  QueryDifferencesRes,
  QueryPlanItemStatisticsReq,
  QueryPlanItemStatisticsRes,
  QueryPlanStatisticsReq,
  QueryPlanStatisticsRes,
  QueryResponseTypeStatisticReq,
  QueryResponseTypeStatisticRes,
  RegressionListRes,
} from "./Replay.type";

export default class ReplayService {
  static async regressionList() {
    return request
      .get<RegressionListRes>(`/config/application/regressionList`)
      .then((res) => Promise.resolve(res.body.map((item) => item.application)));
  }

  static async queryPlanStatistics(params: QueryPlanStatisticsReq) {
    return request
      .post<QueryPlanStatisticsRes>(`/report/queryPlanStatistics`, params)
      .then((res) =>
        Promise.resolve(
          res.body.planStatisticList.sort(
            (a, b) => b.replayStartTime - a.replayStartTime
          )
        )
      );
  }

  static async queryPlanItemStatistics(params: QueryPlanItemStatisticsReq) {
    return request
      .post<QueryPlanItemStatisticsRes>(
        `/report/queryPlanItemStatistics`,
        params
      )
      .then((res) => Promise.resolve(res.body.planItemStatisticList));
  }

  static async queryResponseTypeStatistic(
    params: QueryResponseTypeStatisticReq
  ) {
    return request
      .post<QueryResponseTypeStatisticRes>(
        `/report/queryResponseTypeStatistic`,
        params
      )
      .then((res) => Promise.resolve(res.body.categoryStatisticList || []));
  }

  static async queryDifferences(params: QueryDifferencesReq) {
    return request
      .post<QueryDifferencesRes>(`report/queryDifferences`, params)
      .then((res) => Promise.resolve(res.body.differences));
  }
}
