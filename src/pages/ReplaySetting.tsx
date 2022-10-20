import { css } from '@emotion/react';
import { Tabs } from 'antd';

import {
  NodesIgnore,
  NodesSort,
  SettingImportYaml,
  SettingRecord,
  SettingReplay,
} from '../components/replay/Setting';
import { ApplicationDataType } from '../services/Replay.type';
import { PageFC } from './index';

const { TabPane } = Tabs;
const ReplaySetting: PageFC<ApplicationDataType> = (props) => {
  const data = props.page.data;
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
          <SettingRecord appId={data.appId} agentVersion={data.agentVersion} />
        </TabPane>

        <TabPane tab='Replay' key='replay'>
          <SettingReplay appId={data.appId} agentVersion={data.agentVersion} />
        </TabPane>

        <TabPane tab='ImportYaml' key='importYaml'>
          <SettingImportYaml appId={data.appId} agentVersion={data.agentVersion} />
        </TabPane>

        <TabPane tab='NodesIgnore' key='nodesIgnore'>
          <NodesIgnore appId={data.appId} />
        </TabPane>

        <TabPane tab='NodesSort' key='nodesSort'>
          <NodesSort appId={data.appId} />
        </TabPane>
      </Tabs>
    </>
  );
};

export default ReplaySetting;
