import { SettingOutlined } from '@ant-design/icons';
import { DiffPath } from '@arextest/arex-common';
import {
  ArexPaneFC,
  css,
  Label,
  PaneDrawer,
  PathHandler,
  SceneCode,
  TooltipButton,
  useTranslation,
} from '@arextest/arex-core';
import { useRequest, useSize } from 'ahooks';
import { App, Card, Collapse, Space, Typography } from 'antd';
import React, { ReactNode, useCallback, useMemo, useRef, useState } from 'react';

import CompareConfig from '@/panes/AppSetting/CompareConfig';
import { ComparisonService, ReportService, ScheduleService } from '@/services';
import { DependencyParams } from '@/services/ComparisonService';
import { InfoItem, PlanItemStatistics, SubScene } from '@/services/ReportService';

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
  const { t } = useTranslation(['components']);
  const wrapperRef = useRef(null);
  const size = useSize(wrapperRef);
  const { message } = App.useApp();

  const [modalOpen, setModalOpen] = useState(0); // 0-close 1-open-diffMsg 2-open-diffMsgAll
  const [compareConfigOpen, setCompareConfigOpen] = useState<boolean>(false);

  const [modalData, setModalData] = useState<InfoItem[]>([]);
  const [targetNodePath, setTargetNodePath] = useState<string[]>();
  const [subSceneList, setSubSceneList] = useState<SubScene[]>([]);
  const [modalTitle, setModalTitle] = useState<ReactNode[]>();

  // false 不存在 DependencyId，不显示 Dependency 配置
  // undefined 未指定 DependencyId，显示所有 Dependency 配置
  // string 指定 DependencyId，显示指定 Dependency 配置
  const [selectedDependency, setSelectedDependency] = useState<InfoItem>();

  const { data: sceneInfo = [] } = useRequest(() =>
    ReportService.querySceneInfo({
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
  const fullLinkInfoMerged = useMemo<InfoItem[]>(() => {
    const { entrance, infoItemList } = fullLinkInfo || {};
    return ([{ ...entrance, isEntry: true }, ...(infoItemList || [])] as InfoItem[]).filter(
      (item) => item.id,
    );
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
    setModalData(fullLinkInfoMerged);
    setModalTitle(title);
    setModalOpen(2);
  };

  const { run: insertIgnoreNode } = useRequest(
    (path: string[], global?: boolean) => {
      const dependencyParams: DependencyParams =
        global || selectedDependency?.isEntry
          ? ({} as DependencyParams)
          : {
              operationType: selectedDependency?.categoryName || selectedDependency?.operationType,
              operationName: selectedDependency?.operationName,
            };

      return ComparisonService.insertIgnoreNode({
        operationId: global ? undefined : props.data.operationId,
        appId: props.data.appId,
        exclusions: path,
        ...dependencyParams,
      });
    },
    {
      manual: true,
      onSuccess(success) {
        success && message.success(t('message.success', { ns: 'common' }));
      },
    },
  );

  function handleClickCompareConfigSetting(data?: InfoItem) {
    setSelectedDependency(data);
    setCompareConfigOpen(true);
  }

  const handleIgnoreKey = useCallback<PathHandler>(
    ({ path, type }) => insertIgnoreNode(path, type === 'global'),
    [insertIgnoreNode],
  );
  const handleSortKey = useCallback<PathHandler>(({ path }) => {
    setTargetNodePath(path);
    setCompareConfigOpen(true);
  }, []);

  const collapseItems = useMemo(
    () =>
      sceneInfo.map((scene, index) => {
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
              <Space key={i}>
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

        return {
          key: index,
          label: fullPath,
          children: (
            <SubScenesMenu
              data={subSceneList || []}
              onClick={getQueryFullLinkInfo}
              onClickAllDiff={handleClickAllDiff}
            />
          ),
        };
      }),
    [getQueryFullLinkInfo, handleClickAllDiff, sceneInfo, subSceneList],
  );

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
          items={collapseItems}
          onChange={([index]) => {
            if (index !== undefined) setSubSceneList(sceneInfo[parseInt(index)].subScenes);
            else setFullLinkInfo(undefined);
          }}
          css={css`
            .ant-collapse-content-box {
              padding: 8px !important;
            }
          `}
        />

        {treeData && (
          <FlowTree
            bordered
            width={size?.width && size.width - 32}
            data={treeData}
            onClick={(data) => {
              setModalData([data]);
              setModalOpen(1);
            }}
          />
        )}

        <PaneDrawer
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
                // contextMenuDisabled
                mode={modalOpen === 2 ? 'multiple' : 'single'} // TODO extra render on single mode
                defaultOnlyFailed={modalOpen === 2}
                operationId={props.data.operationId}
                extra={
                  <TooltipButton
                    icon={<SettingOutlined />}
                    title={t('appSetting.compareConfig')}
                    onClick={() => handleClickCompareConfigSetting()}
                  />
                }
                itemsExtraRender={(data) => (
                  <TooltipButton
                    icon={<SettingOutlined />}
                    title={t('appSetting.compareConfig')}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClickCompareConfigSetting(data);
                    }}
                    style={{ marginRight: '6px' }}
                  />
                )}
                loading={loadingFullLinkInfo}
                data={modalData}
                onChange={setSelectedDependency}
                onIgnoreKey={handleIgnoreKey}
                onSortKey={handleSortKey}
                requestDiffMsg={ScheduleService.queryDiffMsgById}
                requestQueryLogEntity={ScheduleService.queryLogEntity}
              />
            )}
          </Card>
        </PaneDrawer>
      </Space>

      {/* CompareConfigModal */}
      <PaneDrawer
        destroyOnClose
        width='70%'
        footer={false}
        title={`${t('appSetting.compareConfig')} - ${props.data.operationName}`}
        open={compareConfigOpen}
        onClose={() => {
          setCompareConfigOpen(false);
          setTargetNodePath(undefined);
        }}
      >
        <CompareConfig
          appId={props.data.appId}
          operationId={props.data.operationId || false}
          dependency={
            selectedDependency
              ? selectedDependency.isEntry
                ? false
                : {
                    operationName: selectedDependency.operationName,
                    operationType:
                      selectedDependency.categoryName || selectedDependency.operationType,
                  }
              : undefined
          }
          sortArrayPath={targetNodePath}
          onSortDrawerClose={() => setTargetNodePath(undefined)}
        />
      </PaneDrawer>
    </div>
  );
};

export default ReplayDiffScenes;
