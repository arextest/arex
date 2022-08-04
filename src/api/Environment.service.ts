import request from './axios';
import { EnvironmentSave, GetEnvironmentRes, EnvironmentSaveReq } from './Environment.type';

export default class EnvironmentService {
  static async getEnvironment(params: GetEnvironmentRes): Promise<any> {
    return request.post(`/api/environment/queryEnvsByWorkspace`, params);
  }

  static async saveEnvironment(params: EnvironmentSave): Promise<any> {
    return request.post(`/api/environment/saveEnvironment`, params);
  }

  static async deleteEnvironment(id: string): Promise<any> {
    return request.delete(`/api/environment/${id}`);
  }
}
