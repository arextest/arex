// ------ /config/application/regressionList ------
export interface ApplicationDataType {
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
  planId: string;
  planName: string;
  status: number;
  appId: string;
  appName: string;
  creator: string;
  targetImageId: string;
  targetImageName: string;
  caseSourceType: number;
  caseEndTime?: number;
  caseStartTime?: number;
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
  planId: string;
}

export type PlanItemStatistics = {
  planItemId: string;
  planId: string;
  operationId: string;
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
  planItemId: string;
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
  planItemId: string;
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
  planItemId: string;
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
  caseSourceType?: number;
  caseSourceFrom: number;
  caseSourceTo: number;
  operationCaseInfoList?: { operationId: string }[];
}

export interface CreatePlanRes {
  desc: string;
  result: number;
}

// ------ /report/queryScenes ------
export interface QueryScenesReq {
  categoryName: string;
  differenceName: string;
  operationName: string;
  planItemId: string;
}

export type Scene = {
  compareResultId: string;
  logIndexes: string;
  sceneName: string;
};

export interface QueryScenesRes {
  scenes: Scene[];
}

// ------ /report/queryMsgWithDiff ------
export interface QueryMsgWithDiffReq {
  compareResultId: string;
  logIndexes: string;
  logs: any[];
  logIds?: string[];
  errorCount?: number[];
}

export interface UnmatchedPath {
  nodeName: string;
  index: number;
}

export interface Trace {
  currentTraceLeft?: any;
  currentTraceRight?: any;
}

export interface PathPair {
  unmatchedType: number;
  leftUnmatchedPath: UnmatchedPath[];
  rightUnmatchedPath: UnmatchedPath[];
  listKeys: any[];
  listKeyPath: any[];
  trace: Trace;
}

export type DiffLog = {
  addRefPkNodePathLeft: null;
  addRefPkNodePathRight: null;
  baseValue: string | boolean | null;
  testValue: string | boolean | null;
  logInfo: string;
  logTag: { lv: number; ig: boolean };
  path: string;
  pathPair: PathPair;
};

export type QueryMsgWithDiffRes = {
  baseMsg: string | boolean | null;
  testMsg: string | boolean | null;
  diffResultCode: number;
  logs: DiffLog[];
  recordId: string;
  replayId: string;
};

// ------ /report/queryFullLinkMsg ------
export interface QueryFullLinkMsgReq {
  recordId: string;
  planItemId: string;
}

export interface LogTag {
  errorType: number;
}

export type CompareResult = {
  planId: number;
  operationId: number;
  serviceName: string;
  categoryName: string;
  diffResultCode: number;
  operationName: string;
  replayId: string;
  recordId: string;
  baseMsg: string | null;
  testMsg: string | null;
  planItemId: number;
  logs: DiffLog[] | null;
  type: 'html' | 'json';
};
export interface QueryFullLinkMsgRes {
  compareResults: CompareResult[];
}

// /querySceneInfo/{planId}/{planItemId}
export interface QuerySceneInfoReq {
  planId: string;
  planItemId: string;
}

export interface Detail {
  code: number;
  categoryName: string;
  operationName: string;
}

export interface SubScene {
  recordId: string;
  replayId: string;
  details: Detail[];
}

export interface SceneInfo {
  subScenes: SubScene[]; // could be null;
}

export interface QuerySceneInfoRes {
  sceneInfos: SceneInfo[];
}

// /queryFullLinkInfo/{recordId}/{replayId}
export interface QueryFullLinkInfoReq {
  recordId: string;
  replayId: string;
}

export type infoItem = {
  id: string;
  code: number;
  categoryName: string;
  operationName: string;
};

export interface QueryFullLinkInfoRes {
  entrance: infoItem;
  infoItemList: infoItem[];
}

// /queryDiffMsgById/{id}
export interface QueryDiffMsgByIdReq {
  id: string;
}

export type CompareResultDetail = {
  id: string;
  categoryName: string;
  operationName: string;
  diffResultCode: number;
  logs: DiffLog[] | null;
  baseMsg: string;
  testMsg: string;
};
export interface QueryDiffMsgByIdRes {
  compareResultDetail: CompareResultDetail;
}
