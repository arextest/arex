import request from "./axios";
import {
  QueryInterfaceReq,
  QueryInterfaceRes,
  QueryPlanItemStatisticsReq,
  QueryPlanItemStatisticsRes,
  QueryPlanStatisticsReq,
  QueryPlanStatisticsRes,
  QueryWorkspaceByIdReq,
  QueryWorkspaceByIdRes,
  RegressionListRes,
  SaveInterfaceReq,
  SaveInterfaceRes,
} from "./FileSystem.type";
export class FileSystemService {
  static async queryWorkspacesByUser({ id }: any): Promise<any> {
    return request.post(`/api/filesystem/queryWorkspacesByUser`, {
      userName: "zt",
    });
  }

  static async queryWorkspaceById({ id }: QueryWorkspaceByIdReq) {
    return request.post<QueryWorkspaceByIdRes>(
      `/api/filesystem/queryWorkspaceById`,
      {
        id,
      }
    );
  }

  static async addItem(params: any): Promise<any> {
    return request.post(`/api/filesystem/addItem`, params);
  }

  static async removeItem(params: any): Promise<any> {
    return request.post(`/api/filesystem/removeItem`, params);
  }

  static async rename(params: any): Promise<any> {
    return request.post(`/api/filesystem/rename`, params);
  }

  static async queryInterface(params: QueryInterfaceReq) {
    return request.post<QueryInterfaceRes>(
      `/api/filesystem/queryInterface`,
      params
    );
  }

  static async saveInterface(params: SaveInterfaceReq) {
    return request.post<SaveInterfaceRes>(
      `/api/filesystem/saveInterface`,
      params
    );
  }

  static async saveCase(params: SaveInterfaceReq) {
    return request.post<SaveInterfaceRes>(`/api/filesystem/saveCase`, params);
  }

  static async queryCase(params: any) {
    return request.post<any>(`/api/filesystem/queryCase`, params);
  }

  static async regressionList() {
    return request
      .get<RegressionListRes>(
        `http://10.5.153.151:8088/config_api/config/application/regressionList`
      )
      .then((res) => Promise.resolve(res.body));
  }

  static async queryPlanStatistics(params: QueryPlanStatisticsReq) {
    return request
      .post<QueryPlanStatisticsRes>(
        `http://10.5.153.151:8088/report_api/report/queryPlanStatistics`,
        params
      )
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
        `http://10.5.153.151:8088/report_api/report/queryPlanItemStatistics`,
        params
      )
      .then((res) => Promise.resolve(res.body.planItemStatisticList));
  }
}
