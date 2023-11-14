import {
  ArexPaneFC,
  clearLocalStorage,
  PanesTitle,
  setLocalStorage,
  useTranslation,
} from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { Badge, Breadcrumb, Spin, Tabs, theme } from 'antd';
import React, { ReactNode, useEffect, useState } from 'react';

import { APP_ID_KEY, PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { ReportService } from '@/services';
import { RecordResult, ReplayCaseType } from '@/services/ReportService';
import { useMenusPanes } from '@/store';

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
  const { token } = theme.useToken();
  const { activePane } = useMenusPanes();
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
              <Badge
                size='small'
                color={token.colorPrimary}
                offset={[5, -5]}
                count={caseDetailList?.length}
              >
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
      <Breadcrumb
        separator='>'
        items={[
          {
            key: props.data.appId,
            title: <a>{props.data.appName || props.data.appId}</a>,
            onClick: () =>
              navPane({
                type: PanesType.REPLAY,
                id: props.data.appId,
                data: {
                  planId: props.data.planId,
                  planItemId: props.data.planItemId,
                },
              }),
          },
          {
            key: props.data.planItemId,
            title: <a>{props.data.operationName || 'unknown'}</a>,
            onClick: () =>
              navPane({
                type: PanesType.REPLAY_CASE,
                id: props.data.planItemId,
              }),
          },
          {
            key: props.data.recordId,
            title: props.data.recordId,
          },
        ]}
      />
      <PanesTitle title={`${t('replay.recordId')}: ${props.data.recordId}`} />
      <Spin spinning={loading}>
        <Tabs items={tabItems} />
      </Spin>
    </>
  );
};

export default ReplayCaseDetail;
