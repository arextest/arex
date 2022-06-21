import requset from './axios'
export class FileSystemService {
    static async queryWorkspacesByUser({ id }: any): Promise<any> {
        return requset.post(`http://10.5.153.1:8090/api/filesystem/queryWorkspacesByUser`,{"userName":"zt"});
    }
    static async queryWorkspaceById({ id }: any): Promise<any> {
        return requset.post(`http://10.5.153.1:8090/api/filesystem/queryWorkspaceById`,{
            "id": id
        });
    }
  static async addItem(params: any): Promise<any> {
    return requset.post(`http://10.5.153.1:8090/api/filesystem/addItem`,params);
  }
}
