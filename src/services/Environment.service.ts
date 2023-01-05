import request from '../helpers/api/axios';
import {
  EnvironmentDuplicate,
  EnvironmentRemove,
  EnvironmentSave,
  GetEnvironmentReq,
  GetEnvironmentRes,
} from './Environment.type';

export default class EnvironmentService {
  static async getEnvironment(params: GetEnvironmentReq) {
    return request
      .post<GetEnvironmentRes>(`/report/environment/queryEnvsByWorkspace`, params)
      .then((res: any) => Promise.resolve(res.body.environments));
  }

  static async saveEnvironment(params: EnvironmentSave): Promise<any> {
    return request.post(`/report/environment/saveEnvironment`, params);
  }

  static async deleteEnvironment(params: EnvironmentRemove): Promise<any> {
    return request.post(`/report/environment/removeEnvironment`, params);
  }

  static async duplicateEnvironment(params: EnvironmentDuplicate): Promise<any> {
    return request.post(`/report/environment/duplicateEnvironment`, params);
  }
}
