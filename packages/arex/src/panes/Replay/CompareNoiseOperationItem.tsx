import { CodeSandboxOutlined, StarOutlined } from '@ant-design/icons';
import { SpaceBetweenWrapper, useTranslation } from '@arextest/arex-core';
import { Card, Checkbox, List, Tooltip } from 'antd';
import React, { FC, useMemo } from 'react';

import { Connector } from '@/constant';
import { InterfaceNoiseItem, RandomNoise } from '@/services/ScheduleService';

export interface CompareNoiseOperationItemProps {
  appId: string;
  value?: RandomNoise[];
  noise: InterfaceNoiseItem;
  onChange?: (value: string[]) => void;
}

const CompareNoiseOperationItem: FC<CompareNoiseOperationItemProps> = (props) => {
  const { t } = useTranslation('components');
  const value = useMemo(
    () =>
      props.value?.reduce<string[]>((value, cur, index) => {
        value.push(
          ...cur.noiseItemList.map((item) => {
            const entityPath = item.nodeEntity.map((entityItem) => entityItem.nodeName).join('/');
            return entityPath + Connector + index;
          }),
        );
        return value;
      }, []),
    [props.value],
  );

  return (
    <Card key={props.noise.operationId} bodyStyle={{ padding: '8px' }}>
      <Checkbox.Group
        value={value}
        onChange={(value) => props.onChange?.(value as string[])}
        style={{ width: '100%' }}
      >
        <List
          size='small'
          style={{ width: '100%' }}
          dataSource={props.noise.randomNoise}
          renderItem={(operation, randomNoiseIndex) => {
            return (
              <List.Item style={{ display: 'block' }}>
                <SpaceBetweenWrapper>
                  <span>
                    <Tooltip
                      title={t(
                        operation.mockCategoryType.entryPoint
                          ? 'appSetting.entryPoint'
                          : 'appSetting.dependency',
                      )}
                    >
                      <span style={{ marginRight: '4px' }}>
                        {operation.mockCategoryType.entryPoint ? (
                          <StarOutlined />
                        ) : (
                          <CodeSandboxOutlined />
                        )}
                      </span>
                    </Tooltip>
                    {operation.operationName}
                  </span>
                </SpaceBetweenWrapper>
                <List
                  size='small'
                  dataSource={operation.noiseItemList}
                  renderItem={(item) => {
                    const entityPath = item.nodeEntity
                      .map((entityItem) => entityItem.nodeName)
                      .join('/');
                    return (
                      <List.Item style={{ paddingRight: 0 }}>
                        <SpaceBetweenWrapper style={{ width: '100%' }}>
                          <span>{entityPath}</span>
                          <Checkbox
                            className={`denoise-checkbox-${props.appId}`}
                            value={entityPath + Connector + randomNoiseIndex}
                          />
                        </SpaceBetweenWrapper>
                      </List.Item>
                    );
                  }}
                  style={{
                    marginLeft: '16px',
                  }}
                />
              </List.Item>
            );
          }}
        />
      </Checkbox.Group>
    </Card>
  );
};

export default CompareNoiseOperationItem;
