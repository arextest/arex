export type EnvironmentSave = {
  env: {
      envName: string,
      id?: string,
      keyValues?: [
        {
          active: boolean,
          key: string,
          value: string
        }
      ]|never[],
      workspaceId: string|undefined
    }
  };

export interface EnvironmentSaveReq {
  responseStatusType: {
    responseCode: number,
    responseDesc: string,
    timestamp: number
    }
}

export type GetEnvironmentRes = {
  workspaceId:string  
};