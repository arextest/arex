import request from '../api/axios';
import { EnvironmentSave, GetEnvironmentReq, GetEnvironmentRes } from './Environment.type';

export default class EnvironmentService {
  static async getEnvironment(params: GetEnvironmentReq) {
    return request
      .post<GetEnvironmentRes>(`/api/environment/queryEnvsByWorkspace`, params)
      .then((res: any) => Promise.resolve(res.body.environments));
  }

  static async saveEnvironment(params: EnvironmentSave): Promise<any> {
    return request.post(`/api/environment/saveEnvironment`, params);
  }

  static async deleteEnvironment(id: string): Promise<any> {
    return request.delete(`/api/environment/${id}`);
  }
}
