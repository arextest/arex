import axios from 'axios';

import proxy from '../../config/proxy-electron-sass.json';
import { getLocalConfig } from '../helper';

export const ScheduleAxios = axios.create({
  baseURL: proxy
    .find((item) => item.path === '/schedule')
    ?.target.replace('{{companyDomainName}}', getLocalConfig('organization')),
  headers: {
    'arex-tenant-code': getLocalConfig('organization'),
  },
});

export const ReportAxios = axios.create({
  baseURL: proxy
    .find((item) => item.path === '/webApi')
    ?.target.replace('{{companyDomainName}}', getLocalConfig('organization')),
  headers: {
    'arex-tenant-code': getLocalConfig('organization'),
  },
});

export * from './postSend';
export * from './preSend';
export * from './queryCaseId';
export * from './queryReplayMaxQps';
export * from './queryReplaySenderParameters';
