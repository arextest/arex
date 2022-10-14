export interface QueryRecordSettingReq {
  id: string;
}

export interface QueryRecordSettingRes {
  allowDayOfWeeks: number;
  allowTimeOfDayFrom: string;
  allowTimeOfDayTo: string;
  appId: string;
  excludeDependentOperationSet: string[];
  excludeDependentServiceSet: string[];
  excludeOperationSet: string[];
  includeOperationSet: string[];
  includeServiceSet: string[];
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
  id?: string;
  appId?: string;
  fullClassName: string;
  methodName?: string;
  parameterTypes?: string;
  keyFormula?: string;
  configType?: number;
};
export type QueryRecordDynamicClassSettingRes = DynamicClass[];

export interface UpdateDynamicClassSettingReq {
  appId: string;
  fullClassName: string;
  methodName?: string;
  parameterTypes?: string;
  keyFormula?: string;
  configType: number;
}

export type UpdateDynamicClassSettingRes = boolean;

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
