import { Space, Tabs, Tag, Tooltip } from 'antd';
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
          <Space>
            {summary.categoryName}
            {summary.detailInfoList.map((item, key) => (
              <Tooltip key={key} title={SummaryCodeMap[item.code.toString()].message}>
                <Tag color={SummaryCodeMap[item.code.toString()].color}>{item.count}</Tag>
              </Tooltip>
            ))}
          </Space>
        ),
      }))}
      onChange={props.onChange}
    ></Tabs>
  );
};

export default SummaryTabs;
