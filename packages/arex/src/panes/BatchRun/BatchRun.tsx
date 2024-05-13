import { SendOutlined } from '@ant-design/icons';
import {
  ArexPaneFC,
  css,
  EmptyWrapper,
  getLocalStorage,
  Label,
  SpaceBetweenWrapper,
  useTranslation,
} from '@arextest/arex-core';
import { ArexEnvironment, ArexResponse, EnvironmentSelect } from '@arextest/arex-request';
import { ArexRESTRequest } from '@arextest/arex-request/src';
import { useLocalStorageState, useRequest } from 'ahooks';
import { Button, Divider, Flex, Slider, TreeSelect, TreeSelectProps, Typography } from 'antd';
import React, { Key, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useImmer } from 'use-immer';

import { BATCH_RUN_QPS_KEY, WORKSPACE_ENVIRONMENT_PAIR_KEY } from '@/constant';
import BatchRunResultItem from '@/panes/BatchRun/BatchRunResultItem';
import RequestTestStatusMap from '@/panes/BatchRun/RequestTestStatusMap';
import { WorkspaceEnvironmentPair } from '@/panes/Request/EnvironmentDrawer';
import { EnvironmentService, FileSystemService } from '@/services';
import { BatchGetInterfaceCaseReq, CollectionType } from '@/services/FileSystemService';
import { useCollections } from '@/store';
import { decodePaneKey } from '@/store/useMenusPanes';

const BatchRun: ArexPaneFC = (props) => {
  const { paneKey } = props;
  const { t } = useTranslation('page');
  const [workspaceId, id] = useMemo(() => decodePaneKey(paneKey).id.split('-'), [paneKey]);
  const { getCollections, getPath } = useCollections();

  const { collectionsTreeData, collectionsFlatData } = useCollections();

  const [activeEnvironment, setActiveEnvironment] = useState<ArexEnvironment>();
  const [checkValue, setCheckValue] = useState<Key[]>(id ? [id] : []);

  const [processing, setProcessing] = useState(false);

  const [casesResults, setCasesResults] = useImmer<ArexRESTRequest[]>([]);
  const [runResult, setRunResult] = useState<{
    request: ArexRESTRequest;
    response?: ArexResponse;
  }>();

  const [qps, setQps] = useLocalStorageState(BATCH_RUN_QPS_KEY, {
    defaultValue: 10,
  });

  const [timestamp, setTimestamp] = useState<number>();
  const timestampRef = useRef<number>();
  useEffect(() => {
    timestampRef.current = timestamp;
  }, [timestamp]);

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

  const batchGetInterfaceCaseCallback = useCallback(
    async (res: ArexRESTRequest[], _timestamp?: number) => {
      async function processPromiseArray(promiseArray: typeof res, qps: number) {
        for (let i = 0; i < promiseArray.length; i++) {
          if (timestampRef.current !== _timestamp) {
            console.log('timestamp changed, stop batch run');
            setProcessing(false);
            break;
          }

          const batch = promiseArray.slice(i, i + 1);

          setCasesResults((result) => {
            result.push(...batch);
          });

          if (i + 1 < promiseArray.length) {
            await new Promise((resolve) => setTimeout(resolve, 1000 / qps));
          }
        }
      }

      setProcessing(true);
      processPromiseArray(res, qps || 10).then(() => {
        setProcessing(false);
        console.log('batch run finished');
      });
      setRunResult(undefined);
      // setCasesResults(res);
    },
    [timestamp],
  );

  const {
    data: cases = [],
    loading,
    run: batchGetInterfaceCase,
  } = useRequest(FileSystemService.batchGetInterfaceCase, {
    manual: true,
    onBefore: () => {
      setCasesResults([]);
    },
    onSuccess: (res, [params, _timestamp]) => {
      batchGetInterfaceCaseCallback(res, _timestamp);
    },
  });

  const handleBatchRun = () => {
    const nodes = checkValue
      .map((item) => {
        const infoId = item.toString();
        const node = collectionsFlatData[infoId];
        if (!node) return;
        return {
          infoId,
          nodeType: node.nodeType,
        };
      })
      .filter(Boolean) as BatchGetInterfaceCaseReq['nodes'];
    const timestamp = Date.now();
    setTimestamp(timestamp);
    batchGetInterfaceCase({ workspaceId, nodes }, timestamp);
  };

  const handleTreeLoad: TreeSelectProps<CollectionType>['loadData'] = (treeNode) =>
    new Promise<void>((resolve) =>
      resolve(
        getCollections({ workspaceId, parentIds: getPath(treeNode.infoId).map((item) => item.id) }),
      ),
    );

  return (
    <div>
      <SpaceBetweenWrapper>
        <Typography.Text type='secondary' style={{ marginLeft: '16px' }}>
          {t('batchRunPage.selectCaseTip')}
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
          // maxTagCount={3}
          size='small'
          fieldNames={{ label: 'nodeName', value: 'infoId', children: 'children' }}
          value={checkValue}
          treeData={collectionsTreeData}
          showCheckedStrategy={TreeSelect.SHOW_PARENT}
          loadData={handleTreeLoad}
          onChange={setCheckValue}
          style={{ flex: 1, marginRight: '16px' }}
        />

        <Flex align='center'>
          <Label>QPS</Label>
          <Slider min={1} max={20} value={qps} onChange={setQps} style={{ width: '64px' }} />
        </Flex>

        <Button
          type='primary'
          icon={<SendOutlined />}
          loading={processing}
          onClick={handleBatchRun}
          style={{ marginLeft: '16px' }}
        >
          {t('batchRunPage.batchSend')}
        </Button>
      </div>

      <RequestTestStatusMap
        key={checkValue.length} // Add key to force re-render
        data={casesResults}
        environment={activeEnvironment}
        onClick={setRunResult}
      />

      <EmptyWrapper
        loading={loading}
        empty={!cases.length}
        css={css`
          overflow: auto;
        `}
      >
        {runResult && (
          <BatchRunResultItem
            environment={activeEnvironment}
            request={runResult.request}
            response={runResult.response}
          />
        )}
      </EmptyWrapper>
    </div>
  );
};

export default BatchRun;
