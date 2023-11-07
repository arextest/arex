import { AppVisibilityLevel } from '@/services/ApplicationService/createApp';
import { request } from '@/utils';

export type ApplicationDataType = {
  id: string;
  status: number;
  modifiedTime: string;
  appId: string;
  features: number;
  groupName: string;
  groupId: string;
  agentVersion: string;
  agentExtVersion: string;
  appName: string;
  description: string;
  category: string;
  owner: string;
  owners?: string[];
  organizationName: string;
  recordedCaseCount: number;
  visibilityLevel: AppVisibilityLevel;
};

export type RegressionListRes = Array<{
  application: ApplicationDataType;
  regressionConfiguration: {
    appId: string;
    offsetDays: number;
    sendMaxQps: number;
    targetEnv: any[];
  };
}>;

export async function getAppList() {
  return request
    .get<RegressionListRes>('/report/config/application/regressionList')
    .then((res) => Promise.resolve(res.body.map((item) => item.application)));
}
