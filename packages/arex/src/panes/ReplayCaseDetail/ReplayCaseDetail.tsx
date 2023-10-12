import { HomeOutlined } from '@ant-design/icons';
import { ArexPaneFC, PanesTitle, setLocalStorage, useTranslation } from '@arextest/arex-core';
import { clearLocalStorage } from '@arextest/arex-core/src';
import { useRequest } from 'ahooks';
import { Badge, Button, Tabs, theme } from 'antd';
import React, { ReactNode, useEffect, useState } from 'react';

import { APP_ID_KEY, PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { ReportService } from '@/services';
import { RecordResult, ReplayCaseType } from '@/services/ReportService';
import { useMenusPanes } from '@/store';

import CaseDetailTab from './CaseDetailTab';

type TagType = { label: ReactNode; key: string; children: ReactNode };

const ReplayCaseDetail: ArexPaneFC<ReplayCaseType & { appId: string }> = (props) => {
  const { token } = theme.useToken();
  const { t } = useTranslation(['components']);
  const { activePane } = useMenusPanes();
  const navPane = useNavPane();

  const [tabItems, setTabItems] = useState<TagType[]>([]);

  useEffect(() => {
    activePane?.key === props.paneKey && setLocalStorage(APP_ID_KEY, props.data.appId);
    return () => clearLocalStorage(APP_ID_KEY);
  }, [activePane?.id]);

  useRequest(ReportService.viewRecord, {
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
      <PanesTitle
        title={`RecordId: ${props.data.recordId}`}
        extra={
          <Button
            size='small'
            icon={<HomeOutlined />}
            onClick={() =>
              navPane({
                type: PanesType.REPLAY,
                id: props.data.appId,
              })
            }
          >
            {t('replay.replayReport')}
          </Button>
        }
      />
      <Tabs items={tabItems} />
    </>
  );
};

export default ReplayCaseDetail;
