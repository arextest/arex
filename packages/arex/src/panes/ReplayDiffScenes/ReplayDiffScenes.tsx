import { ArexPaneFC, css, DiffPath, Label, SceneCode } from '@arextest/arex-core';
import { useRequest, useSize } from 'ahooks';
import { Card, Collapse, Drawer, Space, Typography } from 'antd';
import React, { ReactNode, useMemo, useRef, useState } from 'react';

import { ComparisonService, ReportService, ScheduleService } from '@/services';
import { infoItem, PlanItemStatistics, SubScene } from '@/services/ReportService';

import FlowTree, { FlowTreeData } from './FlowTree';
import SubScenesMenu, { SubSceneMenuProps } from './SubScenesMenu';

export const SummaryCodeMap: { [key: string]: { color: string; message: string } } = {
  '0': {
    color: 'success',
    message: 'SUCCESS', // 'COMPARED_WITHOUT_DIFFERENCE'
  },
  '1': {
    color: 'magenta',
    message: 'COMPARED_WITH_DIFFERENCE',
  },
  '2': {
    color: 'error',
    message: 'EXCEPTION', // 'COMPARED_INTERNAL_EXCEPTION'
  },
  '3': {
    color: 'orange',
    message: 'SEND_FAILED_NOT_COMPARE',
  },
};

const ReplayDiffScenes: ArexPaneFC<PlanItemStatistics> = (props) => {
  const {
    data: { planId, planItemId },
  } = props;

  const wrapperRef = useRef(null);
  const size = useSize(wrapperRef);

  const [modalOpen, setModalOpen] = useState(0); // 0-close 1-open-diffMsg 2-open-diffMsgAll
  const [modalData, setModalData] = useState<infoItem[]>([]);
  const [subSceneList, setSubSceneList] = useState<SubScene[]>([]);
  const [modalTitle, setModalTitle] = useState<ReactNode[]>();

  const { data: sceneInfo = [] } = useRequest(() =>
    ReportService.querySceneInfo({
      // planId: '6406f9fe78b64d7f552679c9',
      // planItemId: '6406f9fe78b64d7f552679f7',
      planId,
      planItemId,
    }),
  );

  const {
    data: fullLinkInfo,
    loading: loadingFullLinkInfo,
    mutate: setFullLinkInfo,
    run: getQueryFullLinkInfo,
  } = useRequest((recordId) => ReportService.queryFullLinkInfo({ planItemId, recordId }), {
    manual: true,
  });

  const fullLinkInfoMerged = useMemo<infoItem[]>(() => {
    const { entrance, infoItemList } = fullLinkInfo || {};
    return [entrance, ...(infoItemList || [])].filter(Boolean) as infoItem[];
  }, [fullLinkInfo]);

  const treeData = useMemo<FlowTreeData | undefined>(
    () =>
      // @ts-ignore
      fullLinkInfo && {
        name: 'Arex',
        operationName: 'Arex',
        level: 0,
        children: [
          {
            ...fullLinkInfo.entrance,
            name: fullLinkInfo.entrance?.categoryName,
            level: 1,
            children: fullLinkInfo.infoItemList?.map((item) => ({
              ...item,
              name: fullLinkInfo.entrance?.categoryName,
              level: 2,
            })),
          },
        ],
      },
    [fullLinkInfo],
  );

  const handleClickAllDiff: SubSceneMenuProps['onClickAllDiff'] = (recordId, title) => {
    console.log({ fullLinkInfoMerged });
    setModalData(fullLinkInfoMerged);
    setModalTitle(title);
    setModalOpen(2);
  };

  return (
    <div ref={wrapperRef}>
      <Space direction='vertical' style={{ width: '100%' }}>
        <Space style={{ marginBottom: '4px' }}>
          <Typography.Text type='secondary'>
            <Label>planId</Label>
            {planId}
          </Typography.Text>
          <Typography.Text type='secondary'>
            <Label>planItemId</Label>
            {planItemId}
          </Typography.Text>
        </Space>

        {/* 一级: 第一个subScenes details.map(item => item.categoryName + decode(item.code)) */}
        {/* 二级: details.categoryName + decode(item.code) + item.operationName */}

        <Collapse
          accordion
          destroyInactivePanel
          onChange={([index]) => {
            if (index !== undefined) setSubSceneList(sceneInfo[parseInt(index)].subScenes);
            else setFullLinkInfo(undefined);
          }}
        >
          {sceneInfo.map((scene, index) => {
            const firstSubScene = scene.subScenes[0];
            const { fullPath } = firstSubScene.details.reduce<{
              fullPath: ReactNode[];
              pathKeyList: string[];
            }>(
              (path, item, i) => {
                // 去重: code 和 categoryName 组成唯一标识
                const pathKey = `${item.code}-${item.categoryName}`;
                if (path.pathKeyList.includes(pathKey)) return path;

                path.pathKeyList.push(pathKey);
                const title = (
                  <Space key={index}>
                    {item.categoryName}
                    <SceneCode code={item.code} />
                  </Space>
                );

                i && path.fullPath.push('+ ');
                path.fullPath.push(title);
                return path;
              },
              { fullPath: [], pathKeyList: [] },
            );

            return (
              <Collapse.Panel
                header={fullPath}
                key={index}
                css={css`
                  .ant-collapse-content-box {
                    padding: 8px !important;
                  }
                `}
              >
                <SubScenesMenu
                  data={subSceneList || []}
                  onClick={getQueryFullLinkInfo}
                  onClickAllDiff={handleClickAllDiff}
                />
              </Collapse.Panel>
            );
          })}
        </Collapse>

        {treeData && (
          <FlowTree
            bordered
            width={size?.width && size.width - 32}
            data={treeData}
            onClick={(data) => {
              const { id, code, categoryName, operationName } = data;
              setModalData([{ id, code, categoryName, operationName }]);
              setModalOpen(1);
            }}
          />
        )}

        <Drawer
          destroyOnClose
          width='80%'
          open={!!modalOpen}
          title={modalTitle}
          bodyStyle={{ padding: 0 }}
          onClose={() => setModalOpen(0)}
        >
          <Card bordered={false} bodyStyle={{ padding: '0 16px' }} style={{ minHeight: '100%' }}>
            {/* force destroyOnClose */}
            {modalOpen && (
              <DiffPath
                mode={modalOpen === 2 ? 'multiple' : 'single'}
                appId={props.data.appId}
                operationId={props.data.operationId}
                defaultOnlyFailed={modalOpen === 2}
                loading={loadingFullLinkInfo}
                data={modalData}
                requestDiffMsg={ScheduleService.queryDiffMsgById}
                requestQueryLogEntity={ScheduleService.queryLogEntity}
                requestIgnoreNode={(path: string[]) =>
                  ComparisonService.insertIgnoreNode({
                    operationId: props.data.operationId,
                    appId: props.data.appId,
                    exclusions: path,
                  })
                }
              />
            )}
          </Card>
        </Drawer>
      </Space>
    </div>
  );
};

export default ReplayDiffScenes;
