import { SpaceBetweenWrapper } from '@arextest/arex-core';
import { Card, Checkbox, List, Typography } from 'antd';
import React, { FC } from 'react';

import { Connector } from '@/constant';
import { InterfaceNoiseItem } from '@/services/ScheduleService';

export interface CompareNoiseOperationItemProps {
  appId: string;
  noise: InterfaceNoiseItem;
  onChange?: (value: string[]) => void;
}

const CompareNoiseOperationItem: FC<CompareNoiseOperationItemProps> = (props) => {
  return (
    <Card key={props.noise.operationId} bodyStyle={{ padding: '8px' }}>
      <Checkbox.Group
        onChange={(value) => props.onChange?.(value as string[])}
        style={{ width: '100%' }}
      >
        <List
          size='small'
          style={{ width: '100%' }}
          dataSource={props.noise.randomNoise}
          renderItem={(operation, randomNoiseIndex) => (
            <List.Item style={{ display: 'block' }}>
              <SpaceBetweenWrapper>
                <span>
                  {operation.mockCategoryType.entryPoint && (
                    <Typography.Text type='secondary'>[EntryPoint]</Typography.Text>
                  )}{' '}
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
              />
            </List.Item>
          )}
        />
      </Checkbox.Group>
    </Card>
  );
};

export default CompareNoiseOperationItem;
