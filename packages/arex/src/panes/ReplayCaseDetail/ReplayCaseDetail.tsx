import { BugOutlined } from '@ant-design/icons';
import {
  ArexPaneFC,
  clearLocalStorage,
  PanesTitle,
  setLocalStorage,
  useTranslation,
} from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { Badge, Button, Spin, Tabs } from 'antd';
import React, { ReactNode, useEffect, useState } from 'react';

import { PlanItemBreadcrumb } from '@/components';
import { APP_ID_KEY, CollectionNodeType, PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { ReportService } from '@/services';
import { RecordResult, ReplayCaseType } from '@/services/ReportService';
import { useMenusPanes, useWorkspaces } from '@/store';
import { generateId } from '@/utils';

import CaseDetailTab from './CaseDetailTab';

type TagType = { label: ReactNode; key: string; children: ReactNode };
type ReplayCaseDetailData = ReplayCaseType & {
  appId: string;
  planId: string;
  appName: string;
  planItemId: string;
  operationName: string | null;
};

const ReplayCaseDetail: ArexPaneFC<ReplayCaseDetailData> = (props) => {
  const navPane = useNavPane();
  const { activePane } = useMenusPanes();
  const { activeWorkspaceId } = useWorkspaces();
  const { t } = useTranslation('components');

  const [tabItems, setTabItems] = useState<TagType[]>([]);

  useEffect(() => {
    activePane?.key === props.paneKey && setLocalStorage(APP_ID_KEY, props.data.appId);
    return () => clearLocalStorage(APP_ID_KEY);
  }, [activePane?.id]);

  const { loading } = useRequest(ReportService.viewRecord, {
    defaultParams: [
      {
        recordId: props.data.recordId,
      },
    ],
    onSuccess(res) {
      const resultMap = res.reduce<Map<string, RecordResult[]>>((map, cur) => {
        const { categoryType } = cur;
        const { name } = categoryType;
        if (map.has(name)) {
          map.get(name)?.push(cur);
        } else {
          map.set(name, [cur]);
        }
        return map;
      }, new Map());

      setTabItems(
        Array.from(resultMap.keys()).map((categoryName) => {
          const caseDetailList = resultMap.get(categoryName);
          return {
            label: (
              <Badge size='small' offset={[5, -5]} count={caseDetailList?.length}>
                <span>{categoryName}</span>
              </Badge>
            ),
            key: categoryName,
            children: <CaseDetailTab type={categoryName} compareResults={caseDetailList} />,
          };
        }) || [],
      );
    },
  });

  return (
    <>
      <PlanItemBreadcrumb
        type={PanesType.REPLAY_CASE}
        planItemId={props.data.planItemId}
        recordId={props.data.recordId}
      />

      <PanesTitle
        title={`${t('replay.recordId')}: ${props.data.recordId}`}
        extra={
          <Button
            size='small'
            onClick={(e) => {
              e.stopPropagation();
              navPane({
                type: PanesType.REQUEST,
                id: `${activeWorkspaceId}-${CollectionNodeType.case}-${generateId(12)}`,
                // icon: "Get",
                name: `Debug - ${props.data.recordId}`,
                data: {
                  recordId: props.data.recordId,
                  planId: props.data.planId,
                },
              });
            }}
          >
            <BugOutlined />
            {t('replay.debug')}
          </Button>
        }
      />
      <Spin spinning={loading}>
        <Tabs items={tabItems} />
      </Spin>
    </>
  );
};

export default ReplayCaseDetail;
