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
  value?: string;
  options?: ArexEnvironment[];
  onAdd?: (name?: string) => void;
  onChange?: (environment?: ArexEnvironment) => void;
  onEdit?: (environment: ArexEnvironment) => void;
};

const EnvironmentSelect: FC<EnvironmentSelectProps> = (_props) => {
  const { environmentProps } = useArexRequestProps();
  const props = Object.keys(_props).length ? _props : environmentProps;

  const [newEnvironmentName, setNewEnvironmentName] = useState<string>();

  const environmentOptions = useMemo<SelectProps['options']>(
    () =>
      props?.options?.map((env) => ({
        label: env.name,
        value: env.id,
      })),
    [props?.options],
  );

  const handleEnvironmentChange = (environmentId: string) => {
    const newEnv = props?.options?.find((env) => env.id === environmentId);
    props?.onChange?.(newEnv);
  };

  const handleEnvironmentEdit = (environmentId?: string) => {
    if (!environmentId) return;
    const newEnv = props?.options?.find((env) => env.id === environmentId);
    newEnv && props?.onEdit?.(newEnv);
  };

  return (
    <EnvironmentSelectWrapper>
      <Tooltip title={'Environment'} placement='left'>
        <DeploymentUnitOutlined />
      </Tooltip>

      <Select
        bordered={false}
        placeholder='Please select environment'
        value={props?.value}
        popupMatchSelectWidth={210}
        dropdownStyle={{
          right: 4,
        }}
        dropdownRender={(menu) => (
          <>
            {menu}
            {props?.onAdd && (
              <>
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
                    onClick={() => props?.onAdd?.(newEnvironmentName)}
                  />
                </Space>
              </>
            )}
          </>
        )}
        options={environmentOptions}
        onChange={handleEnvironmentChange}
        onDropdownVisibleChange={(open) => !open && setNewEnvironmentName(undefined)}
      />

      {props?.onEdit && (
        <Tooltip title={'Edit'}>
          <Button
            icon={<EditOutlined />}
            type='text'
            onClick={() => handleEnvironmentEdit?.(props?.value)}
          />
        </Tooltip>
      )}
    </EnvironmentSelectWrapper>
  );
};

export default EnvironmentSelect;
