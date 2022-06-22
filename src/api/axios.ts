// axios.ts
import { message } from "antd";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

import { showMessage } from "./status";

// 自定义实例级别的拦截器接口
interface IRequestInterceptors<T = AxiosResponse> {
  // 请求成功
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  // 请求失败
  requestInterceptorCatch?: (error: any) => any;
  // 响应成功
  responseInterceptor?: (res: T) => T;
  // 响应失败
  responseInterceptorCatch?: (error: any) => any;
}

interface IRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: IRequestInterceptors<T>;
}

type IAxiosResponse<T> = {
  ResponseStatus: {
    responseStatusType: {
      responseCode: number;
      responseDesc: "success" | "failure";
      timestamp: number;
    };
  };
  body: T;
};

export class Request {
  instance: AxiosInstance;
  // 该属性从实例中获取
  interceptors?: IRequestInterceptors;

  constructor(config: IRequestConfig) {
    this.instance = axios.create(config);

    // 全局请求拦截
    this.instance.interceptors.request.use(
      (config) => {
        // const store = useStore();
        // // 配置请求头
        // config.headers = {
        //   "Content-Type": "application/json;charset=UTF-8", // 传参方式json
        //   "Access-Token": store.userName,
        //   Authorization: store.userName,
        //   Checkcode: store.checkCode,
        // };

        return config;
      },
      (error) => Promise.reject(error)
    );

    // 全局响应拦截
    this.instance.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        const { response } = error;
        if (response) {
          // 请求已发出，但是不在2xx的范围
          showMessage(response.status); // 传入响应码，匹配响应码对应信息
          return Promise.reject(response.data);
        } else {
          message.warning("网络连接异常,请稍后再试!");
        }
      }
    );

    // 实例级别拦截
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    );
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
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
  get<Res>(url: string, params?: any): Promise<IAxiosResponse<Res>> {
    return this.request<Res>({
      url,
      params,
    });
  }

  // 封装 POST 请求方法
  post<Res>(url: string, params?: any): Promise<IAxiosResponse<Res>> {
    return this.request<Res>({
      url,
      data: params,
      method: "POST",
    });
  }

  // 封装 PATCH 请求方法
  patch<Res>(url: string, params?: any): Promise<IAxiosResponse<Res>> {
    return this.request<Res>({
      url,
      data: params,
      method: "PATCH",
    });
  }

  // 封装 DELETE 请求方法
  delete<Res>(url: string, params?: any): Promise<IAxiosResponse<Res>> {
    return this.request<Res>({
      url,
      data: params,
      method: "DELETE",
    });
  }
}

const request = new Request({
  timeout: import.meta.env.VITE_TIMEOUT,
  // 实例级别的拦截器，在创建axios实例的时候携带拦截器
  // interceptors: {
  //   requestInterceptor: ...
  //     requestInterceptorCatch: ...
  //     responseInterceptor: ...
  //     responseInterceptorCatch: ...
  // }
});

export default request;
