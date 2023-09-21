import { DeploymentUnitOutlined, EditOutlined } from '@ant-design/icons';
import { styled } from '@arextest/arex-core';
import { Button, Select, SelectProps, Tooltip } from 'antd';
import React, { FC, useMemo } from 'react';

import { useArexRequestProps } from '../../hooks';
import { ArexEnvironment } from '../../types';

const EnvironmentSelectWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  border-left: 1px solid ${(props) => props.theme.colorBorder};
  padding: 0 8px;
  .ant-select {
    width: 160px;
    height: 34px;
    margin-left: 0;
    box-sizing: content-box;
    .ant-select-selector {
      height: 100%;
      .ant-select-selection-item {
        line-height: 34px;
      }
    }
  }
`;

export type EnvironmentSelectProps = {
  environmentId?: string;
  environments?: ArexEnvironment[];
  onEnvironmentChange?: (environment?: ArexEnvironment) => void;
};

const EnvironmentSelect: FC<EnvironmentSelectProps> = () => {
  const { environmentId, environments, onEnvironmentChange } = useArexRequestProps();

  const environmentOptions = useMemo<SelectProps['options']>(
    () =>
      environments?.map((env) => ({
        label: env.name,
        value: env.id,
      })),
    [environments],
  );

  const handleEnvironmentChange = (value: string) => {
    const newEnv = environments?.find((env) => env.id === value);
    onEnvironmentChange?.(newEnv);
  };

  return (
    <EnvironmentSelectWrapper>
      <Tooltip title={'Environment'} placement='left'>
        <DeploymentUnitOutlined />
      </Tooltip>

      <Select
        bordered={false}
        placeholder='Please select environment'
        value={environmentId}
        options={environmentOptions}
        onChange={handleEnvironmentChange}
      />

      <Tooltip title={'Edit'}>
        <Button icon={<EditOutlined />} type='text' />
      </Tooltip>
    </EnvironmentSelectWrapper>
  );
};

export default EnvironmentSelect;
