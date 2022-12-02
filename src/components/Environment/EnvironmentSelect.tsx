import styled from '@emotion/styled';
import { Select } from 'antd';
import React from 'react';

import { useStore } from '../../store';

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
  const { currentEnvironment, setCurrentEnvironment, environmentTreeData } = useStore();

  return (
    <EnvironmentSelectWrapper id='environment-select'>
      <Select
        bordered={false}
        value={currentEnvironment?.id}
        getPopupContainer={() => document.getElementById('environment-select') as HTMLElement}
        onChange={setCurrentEnvironment}
      >
        <Option value='0'>No Environment</Option>
        {environmentTreeData?.map((e) => (
          <Option key={e.id} value={e.id}>
            {e.envName}
          </Option>
        ))}
      </Select>
    </EnvironmentSelectWrapper>
  );
};

export default EnvironmentSelect;
