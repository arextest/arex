import { getLocalStorage } from '@arextest/arex-core';
import axios from 'axios';

import { ACCESS_TOKEN_KEY, APP_ID_KEY } from '@/constant';

export type NoiseItem = {
  nodeEntity: {
    nodeName: string;
    index: number;
  }[];
  logIndexes: number[];
  compareResultId: string;
};

export type RandomNoise = {
  mockCategoryType: {
    name: string;
    entryPoint: boolean;
    skipComparison: boolean;
  };
  operationName: string;
  operationType: string;
  noiseItemList: NoiseItem[];
};

export type InterfaceNoiseItem = {
  operationId: string;
  randomNoise: RandomNoise[];
  disorderedArrayNoise: [];
};

export async function queryNoise(planId: string) {
  const res = await axios.get<
    string,
    { data: { data: { interfaceNoiseItemList: InterfaceNoiseItem[] } } }
  >('/schedule/queryNoise?planId=' + planId, {
    headers: {
      'access-token': getLocalStorage<string>(ACCESS_TOKEN_KEY),
      appId: getLocalStorage<string>(APP_ID_KEY),
    },
  });
  return res.data.data.interfaceNoiseItemList;
}
