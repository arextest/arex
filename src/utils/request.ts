import axios from "axios";

// 创建 axios 实例
const service = axios.create({
  timeout: 10000, // 请求超时时间
},);

const err = (error: any) => {
  if (error.response) {
  }
  return Promise.reject(error);
};

// request interceptor
service.interceptors.request.use(
  (config) => {
    return config;
  },
  err,
);

service.interceptors.response.use(
  (response) => {
    const { data } = response;
    return data;
  },
  err,
);

export default service;
