import { getLocalStorage, I18nextLng } from '@arextest/arex-core';
import axios from 'axios';

import { ACCESS_TOKEN_KEY } from '@/constant';

export const MessageMap: {
  [lang in I18nextLng]: {
    [code: number]: string;
  };
} = {
  cn: {
    1: '错误：回放执行失败，可能是由于与正在进行的同一应用程序的另一个计划存在冲突。请检查当前计划状态，并确保它不会与其他正在进行的计划冲突。',
    2: '错误：请求的回放类型不受支持，可能是由于Arex前后端版本不匹配导致。',
    101: '错误：回放应用无接口，请确保在开始回放前应用中已有流量请求并被录制。',
    102: 'Error: Invalid or empty case source types.',
    103: '错误：录制用例时间段无效，请确保开始时间在结束时间之前。',
    104: '错误： 回放环境无法加载活动实例，可能是由于代理未能启动或网络问题造成的。',
    200: '错误：该时间段内无录制用例，请更改时间段。',
    300: '数据库错误：可能是由于无效的连接串引起的。',
    500: '未知异常。',
  },
  en: {
    1: 'Error: The execution of the plan failed due to a possible conflict with another plan in process for the same app. Please check the current plan status and ensure that it does not conflict with any other ongoing plans.',
    2: 'Error: The requested replay types is not supported, which may be caused by unmatched backend and frontend versions. Please try using another replay types or check the configuration of the backend services.',
    101: 'Error: No interface found, please make sure there are traffic requests in the application before starting a replay plan.',
    102: 'Error: Invalid or empty case source types.',
    103: 'Error: The provided case range is invalid. Please ensure that the start time precedes the end time.',
    104: 'Error: Unable to load active instance which may be caused by agent failing to init or a network issue.',
    200: 'Error: No recorded cases found in the requested case range, please change the case range.',
    300: 'Error: A DB error might be caused by invalid connection string.',
    500: 'Unchecked exception.',
  },
};

export type CaseTags = Record<string, string> | null;

export type CreatePlanReq = {
  appId: string;
  sourceEnv: string | null;
  targetEnv: string | null;
  operator: string;
  replayPlanType: number;
  planName?: string;
  caseSourceType?: number;
  caseSourceFrom: number;
  caseSourceTo: number;
  operationCaseInfoList?: { operationId: string; replayIdList?: string[] }[];
  caseTags?: CaseTags;
};

export type CreatePlanRes = {
  desc: string;
  result: number;
  data: { reasonCode: number; replayPlanId: string };
};

export function createPlan(params: CreatePlanReq) {
  return new Promise<CreatePlanRes>((resolve, reject) => {
    return axios
      .post<CreatePlanRes>('/schedule/createPlan', params, {
        headers: {
          'access-token': getLocalStorage<string>(ACCESS_TOKEN_KEY),
          appId: params.appId,
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
