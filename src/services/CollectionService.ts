import axios from "axios";

export class CollectionService {
    static listCollection(params:{id:string}){
        return axios.post(`/api/filesystem/queryWorkspaceById`, params)
    }
}
