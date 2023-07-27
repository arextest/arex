import { getLocalStorage } from '@arextest/arex-core';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import proxy from '@/config/proxy';
import { ACCESS_TOKEN_KEY } from '@/constant';

type IRequestConfig<T = AxiosResponse> = AxiosRequestConfig;

export type ResponseStatusType = {
  responseCode: number;
  responseDesc: string;
  timestamp: number;
};

export type IAxiosResponse<T> = {
  responseStatusType: ResponseStatusType;
  body: T;
};

export class Request {
  instance: AxiosInstance;
  proxyPath: string[];

  constructor(config: IRequestConfig) {
    this.instance = axios.create(config);
    this.proxyPath = proxy.map((item) => item.path);

    // 全局请求拦截
    this.instance.interceptors.request.use(
      (config) => {
        // @ts-ignore
        config.headers = {
          'access-token': getLocalStorage<string>(ACCESS_TOKEN_KEY),
        };

        if (import.meta.env.MODE === 'electron' && !process.env['VITE_DEV_SERVER_URL']) {
          let path: string | undefined = undefined;
          if ((path = this.proxyPath.find((path) => config.url?.startsWith(path)))) {
            config.baseURL = proxy.find((item) => item.path === path)?.target;
            config.url = config.url?.match(new RegExp(`(?<=${path}).*`))?.[0];
          }
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    // 全局响应拦截
    this.instance.interceptors.response.use(
      (response) => {
        if (response.data.responseStatusType.responseCode === 4) {
          return Promise.reject(response.data.responseStatusType);
        }
        return Promise.resolve(response.data);
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }

  // 返回的Promise中结果类型为AxiosResponse<any>
  request<Res>(config: AxiosRequestConfig): Promise<IAxiosResponse<Res>> {
    return new Promise<IAxiosResponse<Res>>((resolve, reject) => {
      this.instance
        .request<any, IAxiosResponse<Res>>(config)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  // 封装 GET 请求方法
  get<Res>(url: string, params?: any, config?: AxiosRequestConfig): Promise<IAxiosResponse<Res>> {
    return this.request<Res>({
      url,
      params,
      ...config,
    });
  }

  // 封装 POST 请求方法
  post<Res>(url: string, params?: any, config?: AxiosRequestConfig): Promise<IAxiosResponse<Res>> {
    return this.request<Res>({
      url,
      data: params,
      method: 'POST',
      ...config,
    });
  }

  // 封装 PATCH 请求方法
  patch<Res>(url: string, params?: any, config?: AxiosRequestConfig): Promise<IAxiosResponse<Res>> {
    return this.request<Res>({
      url,
      data: params,
      method: 'PATCH',
      ...config,
    });
  }

  // 封装 DELETE 请求方法
  delete<Res>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig,
  ): Promise<IAxiosResponse<Res>> {
    return this.request<Res>({
      url,
      data: params,
      method: 'DELETE',
      ...config,
    });
  }
}

const request = new Request({
  timeout: 300000,
});

export default request;
