import { SpaceBetweenWrapper } from '@arextest/arex-core';
import { Card, Checkbox, List, theme, Typography } from 'antd';
import React, { FC } from 'react';

import { Connector } from '@/constant';
import { InterfaceNoiseItem } from '@/services/ScheduleService';

export interface CompareNoiseOperationItemProps {
  noise: InterfaceNoiseItem;
  onChange?: (value: string[]) => void;
}

const CompareNoiseOperationItem: FC<CompareNoiseOperationItemProps> = (props) => {
  const { token } = theme.useToken();
  return (
    <Card key={props.noise.operationId} bodyStyle={{ padding: '8px' }}>
      <SpaceBetweenWrapper>
        <span>operationId: {props.noise.operationId}</span>

        {/*<Typography.Text type='secondary'>*/}
        {/*  check all: <Checkbox />*/}
        {/*</Typography.Text>*/}
      </SpaceBetweenWrapper>
      <Checkbox.Group
        style={{ width: '100%' }}
        onChange={(value) => props.onChange?.(value as string[])}
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

                {/* TODO */}
                {/*<Checkbox checked={operation.noiseItemList.length} />*/}
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
                        <Checkbox value={entityPath + Connector + randomNoiseIndex} />
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
