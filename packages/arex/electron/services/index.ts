import axios from 'axios';
import { log } from 'electron-log';
import process from 'process';

import proxy from '../../config/proxy-electron-sass.json';
import { getLocalConfig } from '../helper';

const companyName =
  process.env.NODE_ENV === 'development'
    ? process.env.VITE_COMPANY_NAME
    : getLocalConfig('companyName');

export const ScheduleAxios = axios.create({
  baseURL: proxy
    .find((item) => item.path === '/schedule')
    ?.target.replace('{{companyDomainName}}', companyName),
  headers: {
    'arex-tenant-code': companyName,
  },
});

export const ReportAxios = axios.create({
  baseURL: proxy
    .find((item) => item.path === '/webApi')
    ?.target.replace('{{companyDomainName}}', companyName),
  headers: {
    'arex-tenant-code': companyName,
  },
});

export * from './postSend';
export * from './preSend';
export * from './queryCaseId';
export * from './queryReplayMaxQps';
export * from './queryReplaySenderParameters';
