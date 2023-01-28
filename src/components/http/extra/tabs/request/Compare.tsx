import styled from '@emotion/styled';
import { Input, Select } from 'antd';
import React, { useContext } from 'react';

import { METHODS } from '../../../../../constant';
import { HttpContext } from '../../../index';

const HeaderWrapper = styled.div`
  display: flex;

  .ant-select > .ant-select-selector {
    width: 120px;
    left: 1px;
    border-radius: 2px 0 0 2px;
    .ant-select-selection-item {
      font-weight: 500;
    }
  }
  .ant-input {
    border-radius: 0 2px 2px 0;
  }
  .ant-btn-group,
  .ant-btn {
    margin-left: 16px;
  }
`;
const Compare = () => {
  const { store, dispatch } = useContext(HttpContext);

  return (
    <HeaderWrapper>
      <Select
        value={store.request.compareMethod}
        options={METHODS.map((i) => ({ value: i, lable: i }))}
        onChange={(value) => {
          dispatch((state) => {
            state.request.compareMethod = value;
          });
        }}
      />
      <Input
        placeholder='Basic usage'
        value={store.request.compareEndpoint}
        onChange={({ target: { value } }) => {
          dispatch((state) => {
            state.request.compareEndpoint = value;
          });
        }}
      />
    </HeaderWrapper>
  );
};

export default Compare;
