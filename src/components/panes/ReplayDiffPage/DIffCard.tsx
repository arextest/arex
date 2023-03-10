import { Card, Col, Menu, Row, Typography } from 'antd';
import React, { FC, useState } from 'react';

import { DetailList, Log } from '../../../services/Replay.type';
import { Label } from '../../styledComponents';

export interface DiffCard {
  data: DetailList;
  loading?: boolean;
}
const DiffCard: FC<DiffCard> = (props) => {
  const [activeLog, setActiveLog] = useState<Log>();
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
              setActiveLog(props.data.logs[parseInt(key)]);
            }}
          />
        </Col>
        <Col span={16}>
          <div>
            <Label>baseValue</Label>
            {activeLog?.baseValue}
          </div>
          <div>
            <Label>testValue</Label>
            {activeLog?.testValue}
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default DiffCard;
