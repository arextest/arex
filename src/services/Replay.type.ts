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
  errorMessage: string | null;
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
  errorMessage?: string | null;
  successCaseCount: number;
  failCaseCount: number;
  waitCaseCount: number;
  percent?: number;
};
export interface QueryPlanItemStatisticsRes {
  planItemStatisticList: PlanItemStatistics[] | null;
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

export interface NodePath {
  nodeName: string;
  index: number;
}

export interface Trace {
  currentTraceLeft?: any;
  currentTraceRight?: any;
}

export interface PathPair {
  unmatchedType: number;
  leftUnmatchedPath: NodePath[];
  rightUnmatchedPath: NodePath[];
  listKeys: any[];
  listKeyPath: any[];
  trace: Trace;
}

export type LogEntity = {
  addRefPkNodePathLeft: null;
  addRefPkNodePathRight: null;
  baseValue: string | boolean | null;
  testValue: string | boolean | null;
  logInfo: string;
  logTag: Record<string, string | number>;
  path: string | null;
  pathPair: PathPair;
  warn: number;
};

export type DiffLog = {
  nodePath: NodePath[];
  logIndex: number;
};

export type QueryMsgWithDiffRes = {
  baseMsg: string | boolean | null;
  testMsg: string | boolean | null;
  diffResultCode: number;
  logs: LogEntity[] | null;
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

export interface QueryLogEntityReq {
  compareResultId: string;
  logIndex: number;
}

export interface QueryLogEntityRes {
  diffResultCode: number;
  logEntity: LogEntity;
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
  count: number;
  recordId: string;
  replayId: string;
  details: Detail[];
}

export interface SceneInfo {
  count: number;
  subScenes: SubScene[]; // could be null;
}

export interface QuerySceneInfoRes {
  sceneInfos: SceneInfo[];
}

// /queryFullLinkInfo/{planItemId}/{recordId}
export interface QueryFullLinkInfoReq {
  recordId: string;
  planItemId: string;
}

export type infoItem = {
  id: string;
  code: number;
  categoryName: string;
  operationName: string;
};

export interface QueryFullLinkInfoRes {
  entrance: infoItem | null;
  infoItemList: infoItem[] | null;
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
  logInfos: DiffLog[] | null;
  exceptionMsg: string | null;
  baseMsg: string;
  testMsg: string;
};
export interface QueryDiffMsgByIdRes {
  compareResultDetail: CompareResultDetail;
}

export interface QueryAllDiffMsgReq {
  recordId: string;
  planItemId: string;
  diffResultCodeList: number[]; // 0-正常，1,2-异常
  pageIndex: number;
  pageSize: number;
  needTotal: boolean;
}

export interface QueryAllDiffMsgRes {
  compareResultDetailList: CompareResultDetail[];
  totalCount: number;
}

export interface ViewRecordReq {
  recordId: string;
}

export interface CategoryType {
  name: string;
  entryPoint: boolean;
  skipComparison: boolean;
}

export interface Attribute {
  requestPath: string;
  catId: string;
  format: string;
  headers: Record<string, string>;
  cookies: Record<string, string>;
  configBatchNo: string;
}

export interface TargetRequest {
  body: string;
  attributes: Attribute;
  type: string | null;
}

export interface TargetResponse {
  body: string;
  attributes?: Attribute;
  type: string | null;
}

export interface RecordResult {
  id: string;
  categoryType: CategoryType;
  replayId: string | any;
  recordId: string;
  appId: string;
  recordEnvironment: number;
  creationTime: number;
  targetRequest: TargetRequest;
  targetResponse: TargetResponse;
  operationName: string;
  recordVersion?: number | any;
}

export interface ViewRecordRes {
  recordResult: RecordResult[];
}
