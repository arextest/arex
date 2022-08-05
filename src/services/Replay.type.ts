// ------ /config/application/regressionList ------
export interface ApplicationDataType {
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
  organizationName: string;
  recordedCaseCount: number;
}
export type RegressionListRes = Array<{
  application: ApplicationDataType;
  regressionConfiguration: {
    appId: string;
    offsetDays: number;
    sendMaxQps: number;
    targetEnv: any[];
  };
}>;

export interface QueryPlanStatisticsReq {
  appId?: string;
  needTotal: boolean;
  pageIndex: number;
  pageSize: number;
}

export type PlanStatistics = {
  planId: number;
  planName: string;
  status: number;
  appId: string;
  appName: string;
  creator: string;
  targetImageId: string;
  targetImageName: string;
  caseSourceType: number;
  sourceEnv: string | null;
  targetEnv: string | null;
  sourceHost: string | null;
  targetHost: string | null;
  coreVersion: string;
  extVersion: string;
  caseRecordVersion: string;
  replayStartTime: number;
  replayEndTime: number;
  recordStartTime: string | null;
  recordEndTime: string | null;
  totalCaseCount: number;
  errorCaseCount: number;
  successCaseCount: number;
  failCaseCount: number;
  waitCaseCount: number;
  totalOperationCount: number;
  errorOperationCount: number | null;
  successOperationCount: number;
  failOperationCount: number | null;
  waitOperationCount: number | null;
  totalServiceCount: number | null;
  percent?: number;
};
export interface QueryPlanStatisticsRes {
  totalCount: number;
  planStatisticList: PlanStatistics[];
}

// ------ /report_api/report/queryPlanItemStatistics ------
export interface QueryPlanItemStatisticsReq {
  planId: number;
}

export type PlanItemStatistics = {
  planItemId: number;
  planId: number;
  operationId: number;
  operationName: string;
  serviceName: string;
  appId: string;
  status: number;
  replayStartTime: number;
  replayEndTime: number;
  sourceHost: string | null;
  sourceEnv: string | null;
  targetHost: string;
  targetEnv: string | null;
  caseSourceType: number;
  caseStartTime: number;
  caseEndTime: number;
  totalCaseCount: number;
  errorCaseCount: number;
  successCaseCount: number;
  failCaseCount: number;
  waitCaseCount: number;
  percent?: number;
};
export interface QueryPlanItemStatisticsRes {
  planItemStatisticList: PlanItemStatistics[];
}

// ------ /report_api/report/queryResponseTypeStatistic ------
export interface QueryResponseTypeStatisticReq {
  planItemId: number;
}
export type CategoryStatistic = {
  categoryName: string;
  errorCaseCount: number;
  failCaseCount: number;
  operationName: string;
  successCaseCount: number;
  totalCaseCount: number;
};
export interface QueryResponseTypeStatisticRes {
  categoryStatisticList: CategoryStatistic[];
}

// ------ /report_api/report/queryDifferences ------
export interface QueryDifferencesReq {
  categoryName: string;
  operationName: string;
  planItemId: number;
}
export type Difference = {
  differenceName: string;
  sceneCount: number;
  caseCount: number;
};
export interface QueryDifferencesRes {
  differences: Difference[];
}

// ------ /report_api/report/queryReplayCase ------
export interface QueryReplayCaseReq {
  needTotal?: boolean;
  pageIndex?: number;
  pageSize?: number;
  planItemId: number;
}
export type ReplayCase = {
  replayId: string;
  recordId: string;
  diffResultCode: number;
};
export interface QueryReplayCaseRes {
  result: ReplayCase[];
  totalCount: number;
}

// ------ /schedule/createPlan ------
export interface CreatePlanReq {
  appId: string;
  sourceEnv: string;
  targetEnv: string;
  operator: string;
  replayPlanType: number;
}

export interface CreatePlanRes {
  desc: string;
  result: number;
}
