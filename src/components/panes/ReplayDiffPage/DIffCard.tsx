import { css } from '@emotion/react';
import { Card, Col, Empty, Menu, Row, Typography } from 'antd';
import React, { FC, useEffect, useState } from 'react';

import { DetailList, DiffLog } from '../../../services/Replay.type';
import DiffJsonView from '../../replay/Analysis/DiffJsonView';
import { EmptyWrapper } from '../../styledComponents';

export interface DiffCard {
  data: DetailList;
  loading?: boolean;
}
const DiffCard: FC<DiffCard> = (props) => {
  const [activeLog, setActiveLog] = useState<DiffLog>();
  useEffect(() => {
    props.data.logs?.length && setActiveLog((props.data.logs as DiffLog[])[0]);
  }, [props.data]);

  return (
    <Card key={props.data.id} size='small' title={props.data.operationName} loading={props.loading}>
      {props.data.logs?.length ? (
        <Row gutter={16}>
          <Col span={8}>
            <Menu
              defaultSelectedKeys={['0']}
              items={props.data.logs?.map((log, index) => {
                return {
                  label: (
                    <Typography.Text style={{ color: 'inherit' }}>{log.logInfo}</Typography.Text>
                  ),
                  key: index,
                };
              })}
              onClick={({ key }) => {
                setActiveLog((props.data.logs as DiffLog[])[parseInt(key)]);
              }}
              css={css`
                height: 100%;
                .ant-menu-item {
                  height: 24px;
                  line-height: 24px;
                }
              `}
            />
          </Col>

          <Col span={16}>
            {activeLog && (
              <DiffJsonView
                data={{
                  baseMsg: activeLog.baseValue,
                  testMsg: activeLog.testValue,
                  logs: [activeLog],
                }}
              />
            )}
          </Col>
        </Row>
      ) : (
        <EmptyWrapper empty />
      )}
    </Card>
  );
};

export default DiffCard;
