import axios from "axios";

export class RequestService {
  static retrieveARequest(params: { id: string }) {
    return axios.post(`/api/filesystem/queryInterface`, params).then((r) => {
      console.log(r, "rrr");
      return r;
    });
  }
}
