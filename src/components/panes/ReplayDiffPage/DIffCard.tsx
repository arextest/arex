import { Card, Col, Menu, Row, Typography } from 'antd';
import React, { FC } from 'react';

import { DetailList } from '../../../services/Replay.type';

export interface DiffCard {
  data: DetailList;
  loading?: boolean;
}
const DiffCard: FC<DiffCard> = (props) => {
  return (
    <Card key={props.data.id} size='small' title={props.data.operationName} loading={props.loading}>
      <Row gutter={16}>
        <Col span={8}>
          <Menu
            items={props.data.logs.map((log, index) => {
              return {
                label: (
                  <Typography.Text ellipsis style={{ color: 'inherit' }}>
                    {log.logInfo}
                  </Typography.Text>
                ),
                key: index,
              };
            })}
            onClick={({ key }) => {
              console.log(key, props.data);
            }}
          />
        </Col>
        <Col span={16}>
          <div>baseValue</div>
          <div>testValue</div>
        </Col>
      </Row>
    </Card>
  );
};

export default DiffCard;
