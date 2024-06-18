import { ArexRESTResponse } from '@arextest/arex-request';
import React, { FC } from 'react';

export interface CompareProps {
  getResponse?: () => ArexRESTResponse | undefined;
  mockBody?: string;
}

const Compare: FC<CompareProps> = (props) => {
  console.log(props.getResponse?.());
  return (
    <>
      <div>{props.getResponse?.()?.body}</div>
      <div>-------------------------</div>
      <div>{props.mockBody}</div>
    </>
  );
};

export default Compare;
