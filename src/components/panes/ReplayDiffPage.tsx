import { useRequest } from 'ahooks';
import { Button, Card, Col, Divider, List, Row, Space, Tabs, Tag, Tooltip, Typography } from 'antd';
import React, { ReactElement, ReactNode, useState } from 'react';

import ReplayService from '../../services/Replay.service';
import { PlanItemStatistics, SubScene } from '../../services/Replay.type';
import { EmptyWrapper } from '../styledComponents';
import { PageFC } from './index';

/**
 * -1 : exception
 * 0: success
 * 1: value diff
 * 2: left call missing
 * 4: right call missing
 */

const SceneCodeMap: {
  [key: string]: {
    color: string;
    message: string;
  };
} = {
  '-1': {
    color: 'error',
    message: 'exception',
  },
  '0': {
    color: 'success',
    message: 'success',
  },
  '1': { color: 'magenta', message: 'value diff' },
  '2': { color: 'orange', message: 'left call missing' },
  '4': { color: 'blue', message: 'right call missing' },
};

const SummaryCodeMap: { [key: string]: { color: string; message: string } } = {
  '0': {
    color: '',
    message: 'COMPARED_WITHOUT_DIFFERENCE',
  },
  '1': {
    color: '',
    message: 'COMPARED_WITH_DIFFERENCE',
  },
  '2': {
    color: '',
    message: 'COMPARED_INTERNAL_EXCEPTION',
  },
  '3': {
    color: '',
    message: 'SEND_FAILED_NOT_COMPARE',
  },
};

const ReplayDiffPage: PageFC<PlanItemStatistics> = (props) => {
  const {
    page: {
      data: { planId, planItemId },
    },
  } = props;

  const [subSceneList, setSubSceneList] = useState<SubScene[]>([]);
  const [activeIds, setActiveIds] = useState<{ recordId: string; replayId: string }>({
    recordId: '',
    replayId: '',
  });

  const { data: sceneInfo = [] } = useRequest(
    () =>
      ReplayService.querySceneInfo({
        planId: '6406f9fe78b64d7f552679c9',
        planItemId: '6406f9fe78b64d7f552679f7',
      }),
    {
      onSuccess(res) {
        console.log(res);
      },
    },
  );

  const {
    data: fullLinkSummary = [],
    loading: loadingFullLinkSummary,
    run: getFullLinkSummary,
  } = useRequest(ReplayService.queryFullLinkSummary, {
    manual: true,
    onSuccess(res, [params]) {
      console.log(res);
      res.length && getFullLinkMsgWithCategory({ ...params, categoryName: res[0].categoryName });
    },
  });

  const { data: detailList = [], run: getFullLinkMsgWithCategory } = useRequest(
    ReplayService.queryFullLinkMsgWithCategory,
    {
      manual: true,
      onSuccess(res) {
        console.log(res);
      },
    },
  );

  return (
    <>
      planId: {planId} planItemId: {planItemId}
      <Row gutter={16} style={{ marginBottom: '16px' }}>
        {/* 一级: 第一个subScenes details.map(item => item.categoryName + decode(item.code)) */}
        {/* 二级: details.categoryName + decode(item.code) + item.operationName */}
        <Col span={9}>
          <List
            size='small'
            bordered
            dataSource={sceneInfo}
            renderItem={(scene, index) => {
              const firstSubScene = scene.subScenes[0];
              const fullPath = firstSubScene.details.reduce<ReactNode[]>((path, item, i) => {
                const title = (
                  <>
                    {item.categoryName}{' '}
                    <Tag color={SceneCodeMap[item.code.toString()].color}>
                      {SceneCodeMap[item.code.toString()].message}
                    </Tag>
                  </>
                );

                i && path.push('+ ');
                path.push(title);
                return path;
              }, []);

              return (
                <List.Item>
                  <Button
                    block
                    size='small'
                    type='text'
                    onClick={() => {
                      console.log(sceneInfo[index]);
                      setSubSceneList(sceneInfo[index].subScenes);
                    }}
                  >
                    <div key={index}>{fullPath}</div>
                  </Button>
                </List.Item>
              );
            }}
          />
        </Col>

        <Col span={15}>
          <List
            size='small'
            bordered
            dataSource={subSceneList}
            renderItem={(subScene, index) => {
              const fullPath = subScene.details.reduce<ReactNode[]>((path, item, index) => {
                const detail = (
                  <>
                    <Typography.Text>{item.operationName}</Typography.Text>
                    {`${item.categoryName}`}{' '}
                    <Tag color={SceneCodeMap[item.code.toString()].color}>
                      {SceneCodeMap[item.code.toString()].message}
                    </Tag>
                  </>
                );
                index && path.push('+ ');
                path.push(detail);
                return path;
              }, []);

              return (
                <List.Item>
                  <Button
                    block
                    size='small'
                    type='text'
                    onClick={() => {
                      const params = {
                        recordId: subScene.recordId,
                        replayId: subScene.replayId,
                      };
                      setActiveIds(params);
                      getFullLinkSummary(params);
                    }}
                  >
                    <div key={index}>{fullPath}</div>
                  </Button>
                </List.Item>
              );
            }}
          />
        </Col>
      </Row>
      <Card size='small'>
        <EmptyWrapper loading={loadingFullLinkSummary} empty={!fullLinkSummary.length}>
          <Tabs
            onChange={(key) => {
              console.log(key);
              getFullLinkMsgWithCategory({ ...activeIds, categoryName: key });
            }}
          >
            {fullLinkSummary.map((summary) => (
              <Tabs.TabPane
                key={summary.categoryName}
                tab={
                  <Space>
                    {summary.categoryName}
                    {summary.detailInfoList.map((item, key) => (
                      <Tooltip key={key} title={SummaryCodeMap[item.code.toString()].message}>
                        <Tag color={SummaryCodeMap[item.code.toString()].color}>{item.count}</Tag>
                      </Tooltip>
                    ))}
                  </Space>
                }
              />
            ))}
          </Tabs>

          {detailList.map((detail) => (
            <Card key={detail.id} size='small' title={detail.operationName}>
              <Row gutter={16}>
                <Col span={8}>
                  <List
                    size='small'
                    bordered
                    dataSource={detail.logs}
                    renderItem={(log, index) => {
                      return (
                        <List.Item>
                          <Button
                            block
                            size='small'
                            type='text'
                            onClick={() => {
                              console.log(index);
                            }}
                          >
                            <Typography.Text ellipsis>{log.logInfo}</Typography.Text>
                          </Button>
                        </List.Item>
                      );
                    }}
                  />
                </Col>
                <Col span={16}>
                  <div>baseValue</div>
                  <div>testValue</div>
                </Col>
              </Row>
            </Card>
          ))}
        </EmptyWrapper>
      </Card>
    </>
  );
};

export default ReplayDiffPage;
