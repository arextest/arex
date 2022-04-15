import axios from 'axios'

const getServiceBaseApi = () => {
  const href = location.href;
  let exp;
  if ((exp = href.match(/http:\/\/\S+:/))) {
    return exp[0] + 8088;
  } else {
    return location.origin;
  }
};

const err = (error: any) => {
  if (error.response && error.response.data) {
    console.error(error.response.data.message);
  }
  return Promise.reject(error)
};

export const request = (config: object) => {

  const instance = axios.create({
    /*baseURL: "",*/
    timeout: 10000
  });

  instance.interceptors.request.use(config => {
    return config;
  }, err);

  instance.interceptors.response.use((res: any) => {
    const data = res.data;
    if (data.responseCode) {
      console.error(res.config);
      console.error(data.responseDesc);
      return Promise.reject();
    } else {
      return res.config.url.includes("report_api") || res.config.url.includes("config_api") ? data.body : data;
    }
  }, err);
  return instance(config);
};

export const serviceBaseApi = getServiceBaseApi();
export const post = "POST";
export const get = "GET"
