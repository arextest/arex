import axios from 'axios';
import { message } from 'antd';

// 创建 axios 实例
const service = axios.create({
  timeout: 30000, // 请求超时时间
});

const err = (error: any) => {
  if (error.response) {
    message.error(error.response.data.message);
  }
  return Promise.reject(error);
};

// request interceptor
service.interceptors.request.use((config) => {
  if (localStorage.getItem('accessToken')) {
    // @ts-ignore
    config.headers['access-token'] = localStorage.getItem('accessToken');
  }
  // @ts-ignore
  // config.headers['Lang'] = localStorage.getItem('lang') || 'en_US'

  return config;
}, err);

// response interceptor
service.interceptors.response.use((response) => {
  const { status: code, data, statusText: msg } = response;
  // 只要有接口鉴权失败就重定向到/login
  if (data.responseStatusType.responseCode === 2) {
    localStorage.clear();
    window.location.href = '/login';
  }
  return data;
}, err);

export default service;
