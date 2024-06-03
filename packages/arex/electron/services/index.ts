import axios from 'axios';
import logger from 'electron-log';

import proxy from '../../config/proxy-electron-sass.json';
import { getLocalConfig } from '../helper';
import { formatRequestLog, formatResponseLog } from '../logger';

export const ScheduleAxios = axios.create();
export const ReportAxios = axios.create();

ScheduleAxios.interceptors.request.use((request) => {
  request.baseURL = proxy
    .find((item) => item.path === '/schedule')
    ?.target.replace('{{companyDomainName}}', getLocalConfig('organization'));
  request.headers.set('arex-tenant-code', getLocalConfig('organization'));
  logger.log('[ScheduleAxios request]', formatRequestLog(request));
  return request;
});

ScheduleAxios.interceptors.response.use((response) => {
  logger.log('[ScheduleAxios response]', formatResponseLog(response));
  return response;
});

ReportAxios.interceptors.request.use((request) => {
  request.baseURL = proxy
    .find((item) => item.path === '/webApi')
    ?.target.replace('{{companyDomainName}}', getLocalConfig('organization'));
  request.headers.set('arex-tenant-code', getLocalConfig('organization'));
  logger.log('[ScheduleAxios request]', formatRequestLog(request));
  return request;
});

ReportAxios.interceptors.response.use((response) => {
  logger.log('[ScheduleAxios response]', formatResponseLog(response));
  return response;
});

export * from './postSend';
export * from './preSend';
export * from './queryCaseId';
export * from './queryReplayMaxQps';
export * from './queryReplaySenderParameters';
export * from './queryRerunCaseId';
