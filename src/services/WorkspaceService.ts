import useSWR from "swr";
import axios from "axios";

export function useUser(id) {
  const fetcher = (p) => {
    console.log(p, "ppp");
    return axios.post(`/api/filesystem/queryWorkspacesByUser`, {
      userName: "zt",
    }).then((r) => {
      console.log(r, "rrr");
      return r;
    });
  };
  const { data, error } = useSWR(`/api/user/${id}`, fetcher);
  console.log(data);
  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
  };
}
