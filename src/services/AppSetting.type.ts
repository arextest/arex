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

export type OperationInterface = {
  status: number;
  modifiedTime?: number;
  id: string;
  appId: string;
  serviceId: string;
  operationName: string;
  operationType: number;
  operationResponse: string | null;
  recordedCaseCount: number | null;
};
export type OperationData = {
  status: number;
  modifiedTime: number;
  id: string;
  appId: string;
  serviceName: string;
  serviceKey: string;
  operationList: OperationInterface[];
};

export type QueryInterfacesListRes = OperationData[];

export interface UpdateInterfaceResponseReq {
  id: string;
  operationResponse: string;
}

export type IgnoreNode = {
  modifiedTime: string;
  id: string;
  appId: string;
  operationId: string | null;
  expirationType: number;
  expirationDate: string;
  exclusions: string[];
  path: string;
};

export interface InsertIgnoreNodeReq {
  appId: string;
  operationId: string | null; // null 时目标为 Global
  exclusions: string[];
}

export interface UpdateIgnoreNodeReq {
  id: string;
  exclusions: string[];
}
