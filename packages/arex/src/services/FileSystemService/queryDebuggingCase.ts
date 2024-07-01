import { request } from '@/utils';
// case debug时预处理请求头，返回 ‘application/json’ 或 ‘multipart/form-data’
const preHandlerHeaders = (contentType = '') => {
  if (contentType.includes('application/json')) {
    return 'application/json';
  } else if (contentType.includes('multipart/form-data')) {
    return 'multipart/form-data';
  } else {
    return contentType;
  }
};
export async function queryDebuggingCase(params: { recordId: string; planId?: string }) {
  return request
    .get<any>(`/webApi/filesystem/queryDebuggingCase/${params.planId}/${params.recordId}`)
    .then((res) => {
      res.body.body.contentType = preHandlerHeaders(res.body.body.contentType);
      return res;
    });
}
