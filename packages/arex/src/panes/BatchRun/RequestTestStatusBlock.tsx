import { ArexEnvironment, ArexResponse, sendRequest } from '@arextest/arex-request';
import { ArexRESTRequest } from '@arextest/arex-request/src';
import { useRequest } from 'ahooks';
import { theme } from 'antd';
import React, { useEffect, useState } from 'react';

export type RequestTestStatusBlockProps = {
  environment?: ArexEnvironment;
  data: ArexRESTRequest;
  onClick?: (data: { request: ArexRESTRequest; response?: ArexResponse }) => void;
};

const RequestTestStatusBlock = (props: RequestTestStatusBlockProps) => {
  const { token } = theme.useToken();
  const [init, setInit] = useState(true);

  const { data, loading, run, cancel } = useRequest<ArexResponse, any>(
    () => sendRequest(props.data, props.environment),
    {
      manual: true,
      onBefore: () => {
        setInit(false);
      },
    },
  );

  useEffect(() => {
    run();
    return () => {
      cancel();
    };
  }, []);

  const testAllSuccess = data?.testResult?.every((test) => test.passed) ?? true;
  const testAllFail = data?.testResult?.every((test) => !test.passed) ?? false;

  const requestStatusColor =
    init || loading
      ? token.colorFillSecondary
      : // @ts-ignore
      data?.response?.statusCode < 300
      ? token.colorSuccess
      : // @ts-ignore
      data?.response?.statusCode < 400
      ? token.colorWarning
      : token.colorError;

  const testResultStatusColor = data?.testResult?.length
    ? testAllSuccess
      ? token.colorSuccess
      : testAllFail
      ? token.colorError
      : token.colorWarning
    : token.colorFillSecondary;

  return (
    <div
      onClick={() => {
        // !loading &&
        // data &&
        props.onClick?.({
          request: props.data,
          response: data,
        });
      }}
      style={{
        width: '12px',
        // cursor: !loading && data ? 'pointer' : 'default',
        cursor: 'pointer',
        margin: '2px',
      }}
    >
      <div
        style={{
          height: '6px',
          backgroundColor: requestStatusColor,
        }}
      />
      <div
        style={{
          height: '6px',
          backgroundColor: testResultStatusColor,
        }}
      />
    </div>
  );
};

export default RequestTestStatusBlock;
