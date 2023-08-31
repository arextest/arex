import { getLocalStorage, Pane } from '@arextest/arex-core';
import { useEffect } from 'react';

import { AREX_OPEN_NEW_PANEL, EMAIL_KEY } from '@/constant';
import { request } from '@/utils';

const useTrace = (url: string) => {
  useEffect(() => {
    window.addEventListener(AREX_OPEN_NEW_PANEL, (e: CustomEvent<Pane>) => {
      request.post(url, {
        query: `mutation ReportTraceData($data: String!) {    reportTraceData(data: $data) {id}}`,
        operationName: 'ReportTraceData',
        variables: {
          data: JSON.stringify([
            {
              key: 'url',
              value: e.detail.type,
            },
            {
              key: 'username',
              value: getLocalStorage(EMAIL_KEY) || 'unknown',
            },
          ]),
        },
      });
    });
  }, []);
};

export default useTrace;
