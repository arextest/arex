export type GenReq = {
  apiRes?: string;
  currentScript?: string;
  requirement?: string;
  modelName?: string;
};

export type GenRes = {
  code: string;
  explanation: string;
};
