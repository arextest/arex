import { getLocalStorage } from '@arextest/arex-core';
import axios from 'axios';

import { ACCESS_TOKEN_KEY, APP_ID_KEY } from '@/constant';
import { useClientStore } from '@/store';

export type NoiseItem = {
  nodeEntity: {
    nodeName: string;
    index: number;
  }[];
  logIndexes: number[];
  compareResultId: string;
  status?: 1; // 1: already exclude
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
      'arex-tenant-code': useClientStore.getState().organization,
    },
  });

  // filter excluded nodeEntity
  return res.data.data.interfaceNoiseItemList
    .map((operation) => {
      const randomNoise = operation.randomNoise
        .map((noise) => ({
          ...noise,
          noiseItemList: noise.noiseItemList.filter((noiseItem) => noiseItem.status !== 1),
        }))
        .filter((noise) => noise.noiseItemList.length)
        // sort randomNoise by whether is entryPoint
        .sort((a, b) => {
          if (a.mockCategoryType.entryPoint === b.mockCategoryType.entryPoint) return 0;
          if (a.mockCategoryType.entryPoint) return -1;
          return 1;
        });
      return { ...operation, randomNoise };
    })
    .filter((operation) => operation.randomNoise.length);
}
