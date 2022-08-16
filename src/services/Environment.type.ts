export type EnvironmentSave = {
  env: {
    envName: string;
    id?: string;
    keyValues?:
      | [
          {
            active: boolean;
            key: string;
            value: string;
          },
        ]
      | never[];
    workspaceId: string | undefined;
  };
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

export type EnvironmentKeyValues = { key: string; value: string; active: boolean };
export type Environment = {
  envName: string;
  id: string;
  keyValues: EnvironmentKeyValues[];
  workspaceId: string;
};
export interface GetEnvironmentRes {
  environments: Environment[];
}
