import { styled } from '@arextest/arex-core';
import { Select } from 'antd';
import React from 'react';

import useEnvironments, { DefaultEnvironment } from '@/store/useEnvironments';

const { Option } = Select;

const EnvironmentSelectWrapper = styled.div`
  .ant-select {
    height: 36px;
    width: 160px;
    box-sizing: content-box;
    border-left: 1px solid ${(props) => props.theme.colorBorderSecondary};
    margin-left: -1px;
    .ant-select-selector {
      height: 100%;
      .ant-select-selection-item {
        line-height: 34px;
      }
    }
  }
`;

const EnvironmentSelect = () => {
  const { activeEnvironment, environments, setActiveEnvironment } = useEnvironments();

  return (
    <EnvironmentSelectWrapper>
      <Select bordered={false} value={activeEnvironment?.id} onChange={setActiveEnvironment}>
        <Option value={DefaultEnvironment.id}>{DefaultEnvironment.envName}</Option>
        {environments?.map((e) => (
          <Option key={e.id} value={e.id}>
            {e.envName}
          </Option>
        ))}
      </Select>
    </EnvironmentSelectWrapper>
  );
};

export default EnvironmentSelect;
