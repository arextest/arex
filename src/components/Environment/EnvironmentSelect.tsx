import styled from '@emotion/styled';
import { Select, SelectProps } from 'antd';
import React from 'react';

import { useStore } from '../../store';

const { Option } = Select;

const EnvironmentSelectWrapper = styled((props: SelectProps) => (
  <Select bordered={false} {...props} />
))`
  height: 36px;
  width: 200px;
  box-sizing: content-box;
  border-left: 1px solid ${(props) => props.theme.color.border.primary};
  margin-left: -1px;
  .ant-select-selector {
    height: 100%;
    .ant-select-selection-item {
      line-height: 34px;
    }
  }
`;

const EnvironmentSelect = () => {
  const { currentEnvironment, setCurrentEnvironment, environmentTreeData } = useStore();

  return (
    <EnvironmentSelectWrapper value={currentEnvironment?.id} onChange={setCurrentEnvironment}>
      <Option value='0'>No Environment</Option>
      {environmentTreeData?.map((e) => (
        <Option key={e.id} value={e.id}>
          {e.envName}
        </Option>
      ))}
    </EnvironmentSelectWrapper>
  );
};

export default EnvironmentSelect;
