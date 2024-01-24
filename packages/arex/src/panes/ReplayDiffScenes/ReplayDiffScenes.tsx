import { SettingOutlined } from '@ant-design/icons';
import {
  ArexPaneFC,
  clearLocalStorage,
  css,
  EmptyWrapper,
  Label,
  PaneDrawer,
  PanesTitle,
  SceneCode,
  setLocalStorage,
  TooltipButton,
  useTranslation,
} from '@arextest/arex-core';
import { useRequest, useSize } from 'ahooks';
import { App, Card, Collapse, Progress, Space } from 'antd';
import dayjs from 'dayjs';
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';

import { APP_ID_KEY, PanesType } from '@/constant';
import CompareConfig from '@/panes/AppSetting/CompareConfig';
import { IgnoreType } from '@/panes/ReplayCase/CaseDiff/CaseDiffViewer';
import { ComparisonService, ReportService } from '@/services';
import { DependencyParams, ExpirationType } from '@/services/ComparisonService';
import { InfoItem, PlanItemStatistic } from '@/services/ReportService';
import { useMenusPanes } from '@/store';
import { decodePaneKey } from '@/store/useMenusPanes';

import PlanItemNavigation from '../../components/PlanItemNavigation';
import CaseDiff from '../ReplayCase/CaseDiff';
import FlowTree, { FlowTreeData } from './FlowTree';
import MarkExclusionModal, { MarkExclusionModalProps } from './MarkExclusionModal';
import SubScenesMenu, { SubSceneMenuProps } from './SubScenesMenu';

const ReplayDiffScenes: ArexPaneFC = (props) => {
  const { id: planItemId } = useMemo(() => decodePaneKey(props.paneKey), []);
  const [planItemData, setPlanItemData] = useState<PlanItemStatistic>();

  const { t } = useTranslation(['components']);
  const { activePane } = useMenusPanes();

  const wrapperRef = useRef(null);
  const size = useSize(wrapperRef);
  const { message } = App.useApp();

  const [modalOpen, setModalOpen] = useState(0); // 0-close 1-open-diffMsg 2-open-diffMsgAll
  const [compareConfigOpen, setCompareConfigOpen] = useState<boolean>(false);
  const [markExclusionOpen, setMarkExclusionOpen] = useState(false);

  const [modalData, setModalData] = useState<InfoItem[]>([]);
  const [targetNodePath, setTargetNodePath] = useState<string[]>();
  // const [subSceneList, setSubSceneList] = useState<SubScene[]>([]);
  const [subSceneIndex, setSubSceneIndex] = useState(0);
  const [modalTitle, setModalTitle] = useState<ReactNode[]>();

  // false 不存在 DependencyId，不显示 Dependency 配置
  // undefined 未指定 DependencyId，显示所有 Dependency 配置
  // string 指定 DependencyId，显示指定 Dependency 配置
  const [selectedDependency, setSelectedDependency] = useState<InfoItem>();

  useEffect(() => {
    activePane?.key === props.paneKey && setLocalStorage(APP_ID_KEY, planItemData?.appId);
    return () => clearLocalStorage(APP_ID_KEY);
  }, [activePane?.id, planItemData?.appId]);

  const {
    data: sceneInfo = [],
    loading: loadingSceneInfo,
    refresh: querySceneInfo,
  } = useRequest(
    () =>
      ReportService.querySceneInfo({
        planId: planItemData!.planId,
        planItemId,
      }),
    {
      ready: !!planItemData?.planId,
    },
  );
  const subSceneList = useMemo(
    () => sceneInfo[subSceneIndex]?.subScenes || [],
    [sceneInfo, subSceneIndex],
  );

  const {
    data: fullLinkInfo,
    loading: loadingFullLinkInfo,
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
            isEntry: true,
            children: fullLinkInfo.infoItemList?.map((item) => ({
              ...item,
              name: fullLinkInfo.entrance?.categoryName,
              level: 2,
            })),
          },
        ],
      },
    [fullLinkInfo, sceneInfo],
  );

  const handleClickAllDiff: SubSceneMenuProps['onClickAllDiff'] = (recordId, title) => {
    setModalData(fullLinkInfoMerged);
    setModalTitle(title);
    setModalOpen(2);
  };

  const [activeMarkExclusionParams, setActiveMarkExclusionParams] =
    useState<MarkExclusionModalProps>();

  const handleMarkExclusion = (params: MarkExclusionModalProps) => {
    setMarkExclusionOpen(true);
    setActiveMarkExclusionParams(params);
  };

  const { run: insertIgnoreNode } = useRequest(
    (path: string[], type?: IgnoreType) => {
      const isGlobal = type === IgnoreType.Global;
      const isTemporary = type === IgnoreType.Temporary;

      const dependencyParams: DependencyParams =
        isGlobal || selectedDependency?.isEntry
          ? ({} as DependencyParams)
          : {
              operationType: selectedDependency?.categoryName || selectedDependency?.operationType,
              operationName: selectedDependency?.operationName,
            };
      const temporaryParams = isTemporary
        ? {
            expirationType: ExpirationType.temporary,
            expirationDate: dayjs().add(7, 'day').valueOf(),
          }
        : {};

      return ComparisonService.insertIgnoreNode({
        operationId: isGlobal ? undefined : planItemData!.operationId,
        appId: planItemData!.appId,
        exclusions: path,
        ...dependencyParams,
        ...temporaryParams,
      });
    },
    {
      manual: true,
      onSuccess(success) {
        success && message.success(t('message.success', { ns: 'common' }));
      },
    },
  );

  const collapseItems = useMemo(
    () =>
      sceneInfo.map((scene, index) => {
        const checkedCount = scene.subScenes.filter((item) => item.feedbackType).length;
        const allCount = scene.subScenes.length;
        const feedbackProgress = (checkedCount * 100) / allCount;

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
          {
            fullPath: [
              <Progress
                key='progress'
                type='circle'
                format={(percent) =>
                  percent === 100
                    ? '✓ ' + t('replay.allMarked')
                    : `${t('replay.marked')}: ${checkedCount}/${allCount}`
                }
                percent={feedbackProgress}
                size={14}
                style={{ marginRight: '4px' }}
              />,
            ],
            pathKeyList: [],
          },
        );

        return {
          key: index,
          label: fullPath,
          children: (
            <SubScenesMenu
              planId={planItemData!.planId}
              planItemId={planItemData!.planItemId}
              data={subSceneList}
              onClick={getQueryFullLinkInfo}
              onClickAllDiff={handleClickAllDiff}
              onMarkExclusion={handleMarkExclusion}
            />
          ),
        };
      }),
    [getQueryFullLinkInfo, handleClickAllDiff, sceneInfo, subSceneList],
  );

  function handleClickCompareConfigSetting(data?: InfoItem) {
    setSelectedDependency(data);
    setCompareConfigOpen(true);
  }

  return (
    <>
      <PlanItemNavigation
        type={PanesType.DIFF_SCENES}
        planItemId={planItemId}
        onGetPlanItemData={setPlanItemData}
      />

      {planItemData && (
        <PanesTitle
          title={
            <span>
              <Label style={{ font: 'inherit' }}>{t('replay.caseServiceAPI')}</Label>
              {decodeURIComponent(planItemData?.operationName || 'unknown')}
            </span>
          }
        />
      )}

      <div ref={wrapperRef}>
        <EmptyWrapper loading={loadingSceneInfo} empty={!sceneInfo.length}>
          <Space direction='vertical' style={{ width: '100%' }}>
            {/*<Space style={{ marginBottom: '4px' }}>*/}
            {/*  <Typography.Text type='secondary'>*/}
            {/*    <Label>planId</Label>*/}
            {/*    {planId}*/}
            {/*  </Typography.Text>*/}
            {/*  <Typography.Text type='secondary'>*/}
            {/*    <Label>planItemId</Label>*/}
            {/*    {planItemId}*/}
            {/*  </Typography.Text>*/}
            {/*</Space>*/}

            {/* 一级: 第一个subScenes details.map(item => item.categoryName + decode(item.code)) */}
            {/* 二级: details.categoryName + decode(item.code) + item.operationName */}

            <Collapse
              accordion
              destroyInactivePanel
              items={collapseItems}
              onChange={([index]) => {
                setSubSceneIndex(index === undefined ? -1 : parseInt(index));
                // if (index !== undefined) setSubSceneList(sceneInfo[parseInt(index)].subScenes);
                // else setFullLinkInfo(undefined);
              }}
              css={css`
                .ant-collapse-content-box {
                  padding: 8px !important;
                }
              `}
            />

            {treeData && subSceneIndex > -1 && (
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
          </Space>
        </EmptyWrapper>

        {/* CompareConfig */}
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
              <CaseDiff
                // contextMenuDisabled
                mode={modalOpen === 2 ? 'multiple' : 'single'} // TODO extra render on single mode
                defaultOnlyFailed={modalOpen === 2}
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
                onIgnoreKey={insertIgnoreNode}
                onSortKey={(path) => {
                  setTargetNodePath(path);
                  setCompareConfigOpen(true);
                }}
              />
            )}
          </Card>
        </PaneDrawer>

        {/* MarkExclusion */}

        <MarkExclusionModal
          {...activeMarkExclusionParams}
          open={markExclusionOpen}
          onClose={() => {
            setMarkExclusionOpen(false);
            setActiveMarkExclusionParams(undefined);
          }}
          onSuccess={querySceneInfo}
        />

        {/* CompareConfigModal */}
        <PaneDrawer
          destroyOnClose
          width='70%'
          footer={false}
          title={`${t('appSetting.compareConfig')} - ${planItemData?.operationName}`}
          open={compareConfigOpen}
          onClose={() => {
            setCompareConfigOpen(false);
            setTargetNodePath(undefined);
          }}
        >
          <CompareConfig
            appId={planItemData?.appId}
            operationId={planItemData?.operationId || false}
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
    </>
  );
};

export default ReplayDiffScenes;
