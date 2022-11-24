export interface QueryRecordSettingReq {
  id: string;
}

export interface QueryRecordSettingRes {
  allowDayOfWeeks: number;
  allowTimeOfDayFrom: string;
  allowTimeOfDayTo: string;
  appId: string;
  modifiedTime: string;
  sampleRate: number;
  timeMock: boolean;
}

export interface UpdateRecordSettingReq {
  appId: string;
  sampleRate: number;
  allowDayOfWeeks: number;
  allowTimeOfDayFrom: string;
  allowTimeOfDayTo: string;
  includeOperationSet?: string[];
  excludeOperationSet?: string[];
  excludeDependentOperationSet?: string[];
  includeServiceSet?: string[];
  excludeDependentServiceSet?: string[];
}

export type UpdateRecordSettingRes = boolean;

export interface QueryRecordDynamicClassSettingReq {
  appId: string;
}

export type DynamicClass = {
  modifiedTime?: string;
  id: string;
  appId?: string;
  fullClassName: string;
  methodName?: string;
  parameterTypes?: string;
  configType?: number;
};
export type QueryRecordDynamicClassSettingRes = DynamicClass[];

export interface InsertSettingReqInsert {
  appId: string;
  fullClassName: string;
  methodName?: string;
  parameterTypes?: string | null;
  configType: number;
}

export type UpdateSettingReqInsert = {
  id: string;
  fullClassName: string;
  methodName?: string;
  parameterTypes?: string | null;
};

export interface RemoveDynamicClassSettingReq {
  appId: string;
  id: string;
}

export type RemoveDynamicClassSettingRes = boolean;

export type OperationType = 'Global' | 'Interface';
export type OperationInterface<T extends OperationType = 'Global'> = {
  status: number;
  modifiedTime?: number;
  id: OperationId<T>;
  appId: string;
  serviceId: string;
  operationName: string;
  operationType: number;
  operationResponse: string | null;
  recordedCaseCount: number | null;
};

export type ExcludeOperationMap = { [key: string]: string[] };

export type QueryReplaySettingRes = {
  status: number | null;
  modifiedTime: number;
  appId: string;
  excludeOperationMap: ExcludeOperationMap;
  offsetDays: number;
  targetEnv: string[];
  sendMaxQps: number;
};

export interface QueryConfigTemplateRes {
  configTemplate: string;
}

export type UpdateReplaySettingReq = {
  appId: string;
  offsetDays?: number;
  excludeOperationMap?: ExcludeOperationMap;
};

export interface UpdateConfigTemplateReq {
  appId: string;
  configTemplate?: string;
}

export type OperationData<T extends OperationType> = {
  status: number;
  modifiedTime: number;
  id: string;
  appId: string;
  serviceName: string;
  serviceKey: string;
  operationList: OperationInterface<T>[];
};

export type QueryInterfacesListRes<T extends OperationType> = OperationData<T>[];

type OperationIdGlobal = string | null;
type OperationIdInterface = string;
export type OperationId<T extends OperationType> = T extends 'Global'
  ? OperationIdGlobal
  : OperationIdInterface;

export interface UpdateInterfaceResponseReq {
  id: OperationId<'Interface'>;
  operationResponse: string;
}

export type IgnoreNodeBase = {
  appId: string;
  operationId: OperationId<'Global'>;
  exclusions: string[];
};

export type IgnoreNode = IgnoreNodeBase & {
  modifiedTime: string;
  id: string;
  expirationType: number;
  expirationDate: string;
  path: string;
};

export interface UpdateIgnoreNodeReq {
  id: string;
  exclusions: string[];
}

export interface QueryNodeReq<T extends OperationType> {
  appId: string;
  operationId?: OperationId<T>;
}

export type SortNodePathKey = {
  listPath: string[];
  keys: string[][];
};

export type SortNodeBase = SortNodePathKey & {
  appId: string;
  operationId: OperationId<'Interface'>;
};

export type SortNode = SortNodeBase & {
  id: string;
  modifiedTime: number;
  status: number | null;
  expirationType: number;
  expirationDate: number;
  path: string;
  pathKeyList: string[];
};

export interface UpdateSortNodeReq extends SortNodePathKey {
  id: string;
}
