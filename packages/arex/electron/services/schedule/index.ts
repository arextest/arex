import axios from 'axios';

import proxy from '../../../config/proxy.json';
const baseURL: string = proxy.find((item) => item.path === '/schedule')?.target;

export const ScheduleAxios = axios.create({
  baseURL,
});

export * from './postSend';
export * from './preSend';
export * from './queryCaseId';
export * from './queryReplaySenderParameters';
