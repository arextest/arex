import { useRequest } from 'ahooks';
import { Badge, Tabs, theme } from 'antd';
import React, { ReactNode, useState } from 'react';

import { useCustomSearchParams } from '../../router/useCustomSearchParams';
import ReplayService from '../../services/Replay.service';
import { RecordResult } from '../../services/Replay.type';
import CaseDetail from '../replay/CaseDetail';
import { PanesTitle } from '../styledComponents';
import { PageFC } from './index';

type TagType = { label: ReactNode; key: string; children: ReactNode };

export type CaseDetailType = {
  recordId: string;
};

const ReplayCaseDetailPage: PageFC<CaseDetailType> = (props) => {
  const params = useCustomSearchParams();
  const { data = params.query.data } = props.page;
  const { token } = theme.useToken();
  const [tabItems, setTabItems] = useState<TagType[]>([]);

  useRequest(ReplayService.viewRecord, {
    defaultParams: [
      {
        recordId: data.recordId,
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
              <>
                <span>{categoryName}</span>
                <Badge
                  size='small'
                  color={token.colorPrimary}
                  offset={[5, -5]}
                  count={caseDetailList?.length}
                />
              </>
            ),
            key: categoryName,
            children: <CaseDetail type={categoryName} compareResults={caseDetailList} />,
          };
        }) || [],
      );
    },
  });

  return (
    <>
      <PanesTitle title={`RecordId: ${props.page.data.recordId}`} />
      <Tabs items={tabItems} />
    </>
  );
};

export default ReplayCaseDetailPage;
