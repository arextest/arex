import { css } from '@emotion/react';
import { Tabs } from 'antd';
import { FC } from 'react';

import {
  NodesIgnore,
  NodesSort,
  SettingRecord,
  SettingReplay,
} from '../../components/replay/Setting';
import { ApplicationDataType } from '../../services/Replay.type';

export type ReplaySettingProps = {
  data: ApplicationDataType;
};
const { TabPane } = Tabs;
const ReplaySetting: FC<ReplaySettingProps> = (props) => {
  return (
    <>
      <Tabs
        tabPosition='left'
        size='small'
        css={css`
          .ant-tabs-nav-list > .ant-tabs-tab {
            margin: 4px 0 0 0 !important;
          }
          .ant-tabs-tabpane {
            padding: 0 12px;
          }
        `}
      >
        <TabPane tab='Record' key='record'>
          <SettingRecord appId={props.data.appId} agentVersion={props.data.agentVersion} />
        </TabPane>

        <TabPane tab='Replay' key='replay'>
          <SettingReplay appId={props.data.appId} agentVersion={props.data.agentVersion} />
        </TabPane>

        <TabPane tab='NodesIgnore' key='nodesIgnore'>
          <NodesIgnore appId={props.data.appId} />
        </TabPane>

        <TabPane tab='NodesSort' key='nodesSort'>
          <NodesSort appId={props.data.appId} />
        </TabPane>
      </Tabs>
    </>
  );
};

export default ReplaySetting;
