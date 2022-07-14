import request from "./axios";
import {
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
      .then((res) => Promise.resolve(res.body));
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
    return request.post<QueryResponseTypeStatisticRes>(
      `/report/queryResponseTypeStatistic`,
      params
    );
  }
}
