import { css } from '@arextest/arex-core';
import { ArexEnvironment, ArexResponse } from '@arextest/arex-request';
import { ArexRESTRequest } from '@arextest/arex-request/src';
import { theme } from 'antd';
import React from 'react';

import { RunResult } from '@/panes/BatchRun/BatchRun';

export type RequestTestStatusBlockProps = {
  environment?: ArexEnvironment;
  data: RunResult;
  selected?: boolean;
  onClick?: (data: { request: ArexRESTRequest; response?: ArexResponse }) => void;
};

const RequestTestStatusBlock = (props: RequestTestStatusBlockProps) => {
  const { data } = props;
  const { token } = theme.useToken();
  const { request, response } = data;

  const testAllSuccess = response?.testResult?.every((test) => test.passed) ?? true;
  const testAllFail = response?.testResult?.every((test) => !test.passed) ?? false;

  const requestStatusColor = !response
    ? token.colorFillSecondary
    : response?.response?.statusCode ?? 0 < 300
    ? token.colorSuccess
    : response?.response?.statusCode ?? 0 < 400
    ? token.colorWarning
    : token.colorError;

  const testResultStatusColor = response?.testResult?.length
    ? testAllSuccess
      ? token.colorSuccess
      : testAllFail
      ? token.colorError
      : token.colorWarning
    : token.colorFillSecondary;

  return (
    <div
      onClick={() => {
        props.onClick?.({
          request,
          response,
        });
      }}
      style={{
        width: '12px',
        cursor: 'pointer',
        margin: '2px',
      }}
      css={css`
        // 添加hover 动效，放大、加主题色边框阴影
        transition: transform 0.2s;
        &:hover {
          transform: scale(1.2);
        }
        ${props.selected ? `box-shadow: 0 0 0 1px ${token.colorPrimaryHover};` : ''}
      `}
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
