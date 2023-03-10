import { css } from '@emotion/react';
import { Card, Col, Empty, Menu, Row, Typography } from 'antd';
import React, { FC, useCallback, useEffect, useState } from 'react';

import { DetailList, DiffLog, PathPair } from '../../../services/Replay.type';
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

  const pathTitle = useCallback((pathPair: PathPair) => {
    const path =
      pathPair.leftUnmatchedPath.length >= pathPair.rightUnmatchedPath.length
        ? pathPair.leftUnmatchedPath
        : pathPair.rightUnmatchedPath;
    return path.reduce((title, curPair, index) => {
      index && (title += '.');
      title += curPair.nodeName || `[${curPair.index}]`;
      return title;
    }, '');
  }, []);

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
                    <Typography.Text style={{ color: 'inherit' }}>
                      {pathTitle(log.pathPair)}
                    </Typography.Text>
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
