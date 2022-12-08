export type EnvironmentKeyValues = { key: string; value: string; active: boolean };
export type Environment = {
  envName: string;
  id: string;
  keyValues?: EnvironmentKeyValues[];
  workspaceId?: string;
};

export type EnvironmentSave = {
  env: Omit<Environment, 'id'> & { id?: string };
};

export interface EnvironmentSaveReq {
  responseStatusType: {
    responseCode: number;
    responseDesc: string;
    timestamp: number;
  };
}

export interface GetEnvironmentReq {
  workspaceId: string;
}

export interface GetEnvironmentRes {
  environments: Environment[];
}

export interface EnvironmentDuplicate {
  id: string;
  workspaceId: string;
}

export interface EnvironmentRemove {
  id: string;
  workspaceId: string;
}
