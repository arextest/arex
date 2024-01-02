import { DeploymentUnitOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { FlexCenterWrapper, styled, TooltipButton } from '@arextest/arex-core';
import {
  Button,
  Divider,
  Empty,
  Input,
  Select,
  SelectProps,
  Space,
  Tooltip,
  Typography,
} from 'antd';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useArexRequestProps } from '../../hooks';
import { ArexEnvironment } from '../../types';

const EnvironmentSelectWrapper = styled.div`
  width: 216px;
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

  const { t } = useTranslation();
  const [newEnvironmentName, setNewEnvironmentName] = useState<string>();
  const [selectErrorStatus, setSelectErrorStatus] = useState(false);
  const [inputErrorStatus, setInputErrorStatus] = useState(false);

  useEffect(() => {
    selectErrorStatus && setTimeout(() => setSelectErrorStatus(false), 1000);
  }, [selectErrorStatus]);
  useEffect(() => {
    inputErrorStatus && setTimeout(() => setInputErrorStatus(false), 1000);
  }, [inputErrorStatus]);

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
    if (!environmentId) {
      setSelectErrorStatus(true);
      return;
    }
    const newEnv = props?.options?.find((env) => env.id === environmentId);
    newEnv && props?.onEdit?.(newEnv);
  };

  return (
    <EnvironmentSelectWrapper>
      <Tooltip title={t('env.environment')} placement='left'>
        <DeploymentUnitOutlined />
      </Tooltip>

      <Select
        bordered={selectErrorStatus}
        placeholder={t('env.selectEnv')}
        value={props?.value}
        status={selectErrorStatus ? 'error' : undefined}
        popupMatchSelectWidth={210}
        dropdownStyle={{
          right: 4,
        }}
        notFoundContent={
          <FlexCenterWrapper style={{ padding: '12px' }}>
            {Empty.PRESENTED_IMAGE_SIMPLE}
            <Typography.Text type='secondary' style={{ paddingTop: '8px' }}>
              {t('env.noEnv')}
            </Typography.Text>
          </FlexCenterWrapper>
        }
        dropdownRender={(menu) => (
          <>
            {menu}
            {props?.onAdd && (
              <>
                <Divider style={{ margin: '8px 0' }} />
                <Space style={{ padding: '0 8px 4px' }}>
                  <Input
                    size='small'
                    placeholder={t('env.enterEnv') as string}
                    status={inputErrorStatus ? 'error' : undefined}
                    value={newEnvironmentName}
                    onChange={(e) => setNewEnvironmentName(e.target.value)}
                    style={{ width: '162px', marginRight: '4px' }}
                  />
                  <TooltipButton
                    type='text'
                    size='small'
                    icon={<PlusOutlined />}
                    title={t('add.env')}
                    placement='bottomLeft'
                    onClick={() => {
                      if (newEnvironmentName) {
                        props?.onAdd?.(newEnvironmentName);
                      } else {
                        setInputErrorStatus(true);
                      }
                    }}
                  />
                </Space>
              </>
            )}
          </>
        )}
        options={environmentOptions}
        onChange={handleEnvironmentChange}
        onDropdownVisibleChange={(open) => {
          if (!open) {
            setNewEnvironmentName(undefined);
            setInputErrorStatus(false);
          }
        }}
      />

      {props?.onEdit && (
        <Tooltip title={t('edit')}>
          <Button
            type='text'
            size='small'
            icon={<EditOutlined />}
            onClick={() => handleEnvironmentEdit?.(props?.value)}
          />
        </Tooltip>
      )}
    </EnvironmentSelectWrapper>
  );
};

export default EnvironmentSelect;
