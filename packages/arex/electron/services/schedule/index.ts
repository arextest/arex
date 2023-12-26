import axios from 'axios';
import process from 'process';

import proxy from '../../../config/proxy-electron-sass.json';
import { getConfigData } from '../../helper';

const companyName =
  process.env.NODE_ENV === 'development'
    ? process.env.VITE_COMPANY_NAME
    : getConfigData('companyName');

const baseURL: string = proxy
  .find((item) => item.path === '/schedule')
  ?.target.replace('{{companyDomainName}}', companyName);

export const ScheduleAxios = axios.create({
  baseURL,
});

export * from './postSend';
export * from './preSend';
export * from './queryCaseId';
export * from './queryReplaySenderParameters';
