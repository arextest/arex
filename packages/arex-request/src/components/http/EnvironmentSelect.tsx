import { DeploymentUnitOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { styled } from '@arextest/arex-core';
import { Button, Divider, Input, Select, SelectProps, Space, Tooltip } from 'antd';
import React, { FC, useMemo, useState } from 'react';

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
  environmentProps?: {
    environmentId?: string;
    environments?: ArexEnvironment[];
    onAdd?: (name?: string) => void;
    onChange?: (environment?: ArexEnvironment) => void;
    onEdit?: (environment: ArexEnvironment) => void;
  };
};

const EnvironmentSelect: FC<EnvironmentSelectProps> = () => {
  const { environmentProps } = useArexRequestProps();
  const [newEnvironmentName, setNewEnvironmentName] = useState<string>();

  const environmentOptions = useMemo<SelectProps['options']>(
    () =>
      environmentProps?.environments?.map((env) => ({
        label: env.name,
        value: env.id,
      })),
    [environmentProps?.environments],
  );

  const handleEnvironmentChange = (environmentId: string) => {
    const newEnv = environmentProps?.environments?.find((env) => env.id === environmentId);
    environmentProps?.onChange?.(newEnv);
  };

  const handleEnvironmentEdit = (environmentId?: string) => {
    if (!environmentId) return;
    const newEnv = environmentProps?.environments?.find((env) => env.id === environmentId);
    newEnv && environmentProps?.onEdit?.(newEnv);
  };

  return (
    <EnvironmentSelectWrapper>
      <Tooltip title={'Environment'} placement='left'>
        <DeploymentUnitOutlined />
      </Tooltip>

      <Select
        bordered={false}
        placeholder='Please select environment'
        value={environmentProps?.environmentId}
        popupMatchSelectWidth={210}
        dropdownStyle={{
          right: 4,
        }}
        dropdownRender={(menu) => (
          <>
            {menu}
            <Divider style={{ margin: '8px 0' }} />
            <Space style={{ padding: '0 8px 4px' }}>
              <Input
                size='small'
                placeholder='Enter new environment'
                value={newEnvironmentName}
                onChange={(e) => setNewEnvironmentName(e.target.value)}
                style={{ width: '162px', marginRight: '4px' }}
              />
              <Button
                type='text'
                size='small'
                icon={<PlusOutlined />}
                onClick={() => environmentProps?.onAdd?.(newEnvironmentName)}
              />
            </Space>
          </>
        )}
        options={environmentOptions}
        onChange={handleEnvironmentChange}
      />

      <Tooltip title={'Edit'}>
        <Button
          icon={<EditOutlined />}
          type='text'
          onClick={() => handleEnvironmentEdit?.(environmentProps?.environmentId)}
        />
      </Tooltip>
    </EnvironmentSelectWrapper>
  );
};

export default EnvironmentSelect;
