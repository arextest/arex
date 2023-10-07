import {
  ArexPaneFC,
  EmptyWrapper,
  getLocalStorage,
  SpaceBetweenWrapper,
} from '@arextest/arex-core';
import { ArexEnvironment, EnvironmentSelect } from '@arextest/arex-request';
import { useRequest } from 'ahooks';
import { Button, Divider, TreeSelect, Typography } from 'antd';
import { cloneDeep } from 'lodash';
import React, { Key, useCallback, useMemo, useState } from 'react';

import { CollectionNodeType, WORKSPACE_ENVIRONMENT_PAIR_KEY } from '@/constant';
import BatchRunResultItem from '@/panes/BatchRun/BatchRunResultItem';
import { WorkspaceEnvironmentPair } from '@/panes/Request/EnvironmentDrawer';
import { EnvironmentService, FileSystemService } from '@/services';
import { useCollections } from '@/store';
import { decodePaneKey } from '@/store/useMenusPanes';

import disabledNonCaseNode from './utils/disabledNonCaseNode';

const BatchRun: ArexPaneFC = (props) => {
  const { paneKey } = props;
  const [workspaceId, id] = useMemo(() => decodePaneKey(paneKey).id.split('-'), [paneKey]);

  const { collectionsTreeData, collectionsFlatData } = useCollections();

  const [activeEnvironment, setActiveEnvironment] = useState<ArexEnvironment>();
  const [checkValue, setCheckValue] = useState<Key[]>([]);

  const treeData = useMemo(
    () =>
      disabledNonCaseNode(
        cloneDeep(
          id ? collectionsFlatData.get(id)?.children || [] : collectionsTreeData, // collection right click folder to batch run
        ),
      ),
    [collectionsTreeData],
  );

  const { data: environments } = useRequest(EnvironmentService.getEnvironments, {
    defaultParams: [{ workspaceId }],
    onSuccess(res) {
      const workspaceEnvironmentPair = getLocalStorage<WorkspaceEnvironmentPair>(
        WORKSPACE_ENVIRONMENT_PAIR_KEY,
      );
      const initialEnvId = props.data?.environmentId || workspaceEnvironmentPair?.[workspaceId];
      if (initialEnvId) {
        const env = res.find((env) => env.id === initialEnvId);
        setActiveEnvironment(env);
      }
    },
  });

  const {
    data: cases = [],
    loading,
    runAsync: queryCases,
  } = useRequest(() =>
    Promise.all(
      checkValue.map((key) =>
        FileSystemService.queryRequest({ id: String(key), nodeType: CollectionNodeType.case }),
      ),
    ),
  );

  const [casesResults, setCasesResults] = useState<React.ReactNode>(null);
  const handleBatchRun = () => {
    queryCases().then((cases) => setCasesResults(getCasesResults(cases)));
  };

  const getCasesResults = useCallback(
    (cases: Awaited<ReturnType<typeof FileSystemService.queryRequest>>[]) =>
      cases.map((caseItem) => (
        <BatchRunResultItem key={caseItem.id} environment={activeEnvironment} data={caseItem} />
      )),
    [activeEnvironment],
  );

  return (
    <div>
      <SpaceBetweenWrapper>
        <Typography.Text type='secondary' style={{ marginLeft: '16px' }}>
          Select cases for batch execution
        </Typography.Text>
        <EnvironmentSelect
          value={activeEnvironment?.id}
          options={environments}
          onChange={setActiveEnvironment}
        />
      </SpaceBetweenWrapper>
      <Divider style={{ margin: 0 }} />

      <div style={{ display: 'flex', padding: '8px 16px' }}>
        <TreeSelect
          multiple
          allowClear
          treeCheckable
          maxTagCount={3}
          placeholder={'Please select case'}
          fieldNames={{ label: 'nodeName', value: 'infoId', children: 'children' }}
          value={checkValue}
          treeData={treeData.nodeData}
          onChange={setCheckValue}
          style={{ flex: 1 }}
        />

        <Button type='primary' size='large' onClick={handleBatchRun} style={{ marginLeft: '16px' }}>
          Run
        </Button>
      </div>

      <EmptyWrapper loading={loading} empty={!cases.length}>
        {casesResults}
      </EmptyWrapper>
    </div>
  );
};

export default BatchRun;
