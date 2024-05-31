import { getLocalStorage } from '@arextest/arex-core';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { ACCESS_TOKEN_KEY, APP_ID_KEY, isClientProd } from '@/constant';
import { useClientStore } from '@/store';

import port from '../../config/port.json';

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

  constructor(config: IRequestConfig) {
    this.instance = axios.create(config);

    // 全局请求拦截
    this.instance.interceptors.request.use(
      (request) => {
        const accessToken = getLocalStorage<string>(ACCESS_TOKEN_KEY);
        // if (!accessToken && request.headers.get('access-token') !== 'no')
        //   return Promise.reject(
        //     'Required request header "access-token" for method parameter type String is not present',
        //   );

        request.headers.set('arex-tenant-code', useClientStore.getState().organization);

        request.headers.set('access-token', accessToken);
        request.headers.set('appId', getLocalStorage<string>(APP_ID_KEY));

        return request;
      },
      (error) => Promise.reject(error),
    );

    // 全局响应拦截
    this.instance.interceptors.response.use(
      (response) => {
        if (response.data.responseStatusType?.responseCode !== 0) {
          // window.message.error(response.data.responseStatusType.responseDesc);
          return Promise.reject(new Error(response.data.responseStatusType.responseDesc));
        }
        return Promise.resolve(response.data);
      },
      (error) => {
        console.error(error.message);
        window.message.error(error.message);
        // console.log(error.message);
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
  timeout: 30000,
  baseURL: isClientProd ? 'http://localhost:' + port.electronPort : undefined,
});

export default request;
