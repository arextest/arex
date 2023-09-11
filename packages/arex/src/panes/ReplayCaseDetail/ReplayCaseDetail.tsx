import { HomeOutlined } from '@ant-design/icons';
import { ArexPaneFC, PanesTitle, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { Badge, Button, Tabs, theme } from 'antd';
import React, { ReactNode, useState } from 'react';

import { PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { StorageService } from '@/services';
import { ReplayCaseType } from '@/services/ReportService';
import { RecordResult } from '@/services/StorageService';

import CaseDetailTab from './CaseDetailTab';

type TagType = { label: ReactNode; key: string; children: ReactNode };

const ReplayCaseDetail: ArexPaneFC<ReplayCaseType & { appId: string }> = (props) => {
  const { token } = theme.useToken();
  const { t } = useTranslation(['components']);
  const navPane = useNavPane();

  const [tabItems, setTabItems] = useState<TagType[]>([]);

  useRequest(StorageService.viewRecord, {
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
            {t('replay.appReport')}
          </Button>
        }
      />
      <Tabs items={tabItems} />
    </>
  );
};

export default ReplayCaseDetail;
