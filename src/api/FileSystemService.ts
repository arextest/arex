import requset from './axios'
export class FileSystemService {
    static async queryWorkspacesByUser({ id }: any): Promise<any> {
        return requset.post(`/api/filesystem/queryWorkspacesByUser`,{"userName":"zt"});
    }
    static async queryWorkspaceById({ id }: any): Promise<any> {
        return requset.post(`/api/filesystem/queryWorkspaceById`,{
            "id": id
        });
    }
  static async addItem(params: any): Promise<any> {
    return requset.post(`/api/filesystem/addItem`,params);
  }
    static async removeItem(params: any): Promise<any> {
        return requset.post(`/api/filesystem/removeItem`,params);
    }

  static async rename(params: any): Promise<any> {
    return requset.post(`/api/filesystem/rename`,params);
  }
}
