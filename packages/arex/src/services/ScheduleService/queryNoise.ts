import { getLocalStorage } from '@arextest/arex-core';
import axios from 'axios';

import { ACCESS_TOKEN_KEY, APP_ID_KEY } from '@/constant';

export async function queryNoise(planId: string) {
  const res = await axios.get('/schedule/?planId=' + planId, {
    headers: {
      'access-token': getLocalStorage<string>(ACCESS_TOKEN_KEY),
      appId: getLocalStorage<string>(APP_ID_KEY),
    },
  });
  return res.data.data;
}
