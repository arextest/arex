import { Tabs, Tag, Tooltip } from 'antd';
import React, { FC } from 'react';

import { Detail } from '../../../services/Replay.type';
import { SummaryCodeMap } from './index';

export interface SummaryTabsProps {
  data: Detail[];
  onChange?: (categoryName: string) => void;
}
const SummaryTabs: FC<SummaryTabsProps> = (props) => {
  return (
    <Tabs
      items={props.data.map((summary) => ({
        key: summary.categoryName,
        label: (
          <>
            <span style={{ marginRight: '8px' }}>{summary.categoryName}</span>
            {summary.detailInfoList.map((item, key) => (
              <Tooltip key={key} title={SummaryCodeMap[item.code.toString()].message}>
                <Tag color={SummaryCodeMap[item.code.toString()].color}>{item.count}</Tag>
              </Tooltip>
            ))}
          </>
        ),
      }))}
      onChange={props.onChange}
      style={{ marginBottom: '-16px' }}
    />
  );
};

export default SummaryTabs;
