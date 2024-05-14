import { EmptyWrapper, Label } from '@arextest/arex-core';
import { Card, Space, Tag, Typography } from 'antd';
import React, { FC } from 'react';

import { ExpectationResult } from '@/services/ConfigService';

export interface ExpectationResultProps {
  loading?: boolean;
  dataSource?: ExpectationResult[];
}

const ExpectationResult: FC<ExpectationResultProps> = (props) => {
  const { dataSource = [] } = props;

  return (
    <Space direction='vertical' size='middle' style={{ width: '100%', padding: '16px' }}>
      <EmptyWrapper loading={props.loading} empty={!dataSource.length}>
        {dataSource.map((data, index) => (
          <Card key={index}>
            <div>
              <Label>Operation</Label>
              {data.operation}
              <Tag style={{ marginLeft: '8px' }}>{data.category}</Tag>
            </div>
            <div>
              <Label>Message</Label>
              {data.message}
            </div>
            <div>
              <Label>AssertionText</Label>
              <Typography.Paragraph
                ellipsis={{
                  rows: 2,
                  expandable: true,
                  symbol: 'more',
                }}
              >
                {data.assertionText}
              </Typography.Paragraph>
            </div>
          </Card>
        ))}
      </EmptyWrapper>
    </Space>
  );
};

export default ExpectationResult;
