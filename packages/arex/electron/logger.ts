import logger from 'electron-log';
import { join } from 'path';
import { setLocalData } from './helper';
import { app } from 'electron';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

logger.transports.file.maxSize = 1002430; // 10M
logger.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}';
logger.transports.file.resolvePath = () => join(app.getPath('appData'), 'logs/main.log');

setLocalData({ logsPath: join(app.getPath('appData'), 'logs/main.log') });

export function formatRequestLog(req: AxiosRequestConfig): any {
  return {
    baseURL: req.baseURL,
    url: req.url,
    headers: req.headers,
    method: req.method,
    data: req.data,
    params: req.params,
  };
}

export function formatResponseLog(res: AxiosResponse): any {
  return {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
    data: res.data,
    request: formatRequestLog(res.request),
  };
}
