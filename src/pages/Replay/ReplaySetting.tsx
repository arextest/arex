import { css } from '@emotion/react';
import { Tabs } from 'antd';
import { FC } from 'react';

import {
  SettingImportYaml,
  SettingNodesIgnored,
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
        `}
      >
        <TabPane tab='Index' key='record'>
          {/* SettingRecord component */}
          <SettingRecord appId={props.data.appId} agentVersion={props.data.agentVersion} />
        </TabPane>

        <TabPane tab='Replay' key='replay'>
          {/* SettingReplay component */}
          <SettingReplay appId={props.data.appId} agentVersion={props.data.agentVersion} />
        </TabPane>

        {/*<TabPane tab='Import yaml' key='importYaml'>*/}
        {/*  /!* SettingImportYaml component *!/*/}
        {/*  <SettingImportYaml appId={props.data.appId} agentVersion={props.data.agentVersion} />*/}
        {/*</TabPane>*/}

        <TabPane tab='NodesIgnored' key='nodesIgnored'>
          {/* NodeDifferences component */}
          <SettingNodesIgnored />
        </TabPane>
      </Tabs>
    </>
  );
};

export default ReplaySetting;
