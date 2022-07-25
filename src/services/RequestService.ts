import axios from "axios";

// request组件相关

export class RequestService {
  static retrieveARequest(params: { id: string }) {
    return axios.post(`/api/filesystem/queryInterface`, params).then((r) => {
      return r;
    });
  }

  static quickCompare(params: any) {
    return axios.post(`/api/compare/quickCompare`, params)
  }
}
