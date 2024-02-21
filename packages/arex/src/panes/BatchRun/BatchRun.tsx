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
import { useRequest } from 'ahooks';
import { Button, Divider, Flex, Slider, TreeSelect, TreeSelectProps, Typography } from 'antd';
import React, { Key, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useImmer } from 'use-immer';

import { WORKSPACE_ENVIRONMENT_PAIR_KEY } from '@/constant';
import BatchRunResultItem from '@/panes/BatchRun/BatchRunResultItem';
import StatusBlockStructure from '@/panes/BatchRun/StatusBlockStructure';
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
  const [checkValue, setCheckValue] = useState<Key[]>([]);

  const [casesResults, setCasesResults] = useImmer<React.ReactNode[]>([]);
  const [responseList, setResponseList] = useImmer<Record<string, ArexResponse>>([]);

  const [qps, setQps] = useState<number>(10);

  const [timestamp, setTimestamp] = useState<number>();
  const timestampRef = useRef<number>();
  useEffect(() => {
    timestampRef.current = timestamp;
  }, [timestamp]);

  const treeData = useMemo(
    () => (id ? collectionsFlatData.get(id)?.children || [] : collectionsTreeData), // collection right click folder to batch run
    [collectionsFlatData, collectionsTreeData, id],
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

  const batchGetInterfaceCaseCallback = useCallback(
    async (
      res: Awaited<ReturnType<typeof FileSystemService.batchGetInterfaceCase>>,
      _timestamp?: number,
    ) => {
      const list = res.reduce<Record<string, ArexResponse>>((acc, item) => {
        acc[item.id] = { response: { type: 'loading', headers: undefined } };
        return acc;
      }, {});
      setResponseList(list);

      async function processPromiseArray(promiseArray: typeof res, batchSize: number) {
        for (let i = 0; i < promiseArray.length; i += batchSize) {
          console.log(timestampRef.current, _timestamp);
          if (timestampRef.current !== _timestamp) {
            console.log('timestamp changed, stop batch run');
            break;
          }

          const batch = promiseArray.slice(i, i + batchSize);

          setCasesResults((result) => {
            result.push(getCasesResults(batch));
          });

          if (i + batchSize < promiseArray.length) {
            // 等待指定的时间间隔
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
      }

      processPromiseArray(res, qps).then(() => {
        console.log('batch run finished');
      });
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
      setResponseList({});
    },
    onSuccess: (res, [params, _timestamp]) => {
      batchGetInterfaceCaseCallback(res, _timestamp);
    },
  });

  const handleBatchRun = () => {
    const nodes = checkValue
      .map((item) => {
        const infoId = item.toString();
        const node = collectionsFlatData.get(infoId);
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

  const getCasesResults = useCallback(
    (cases: Awaited<ReturnType<typeof FileSystemService.queryRequest>>[]) =>
      cases.map((caseItem) => (
        <BatchRunResultItem
          id={`batch-run-result-item-${caseItem.id}`}
          key={caseItem.id}
          environment={activeEnvironment}
          data={caseItem}
          onResponse={(response) => {
            setResponseList((res) => {
              res[caseItem.id] = response;
            });
          }}
        />
      )),
    [activeEnvironment],
  );

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
          treeData={treeData}
          showCheckedStrategy={TreeSelect.SHOW_PARENT}
          loadData={handleTreeLoad}
          onChange={setCheckValue}
          style={{ flex: 1, marginRight: '16px' }}
        />

        <Flex align='center'>
          <Label>QPS</Label>
          <Slider min={1} max={100} value={qps} onChange={setQps} style={{ width: '64px' }} />
        </Flex>

        <Button
          type='primary'
          icon={<SendOutlined />}
          onClick={handleBatchRun}
          style={{ marginLeft: '16px' }}
        >
          {t('batchRunPage.batchSend')}
        </Button>
      </div>

      <StatusBlockStructure
        key={checkValue.length} // Add key to force re-render
        data={responseList}
      />

      <EmptyWrapper
        loading={loading}
        empty={!cases.length}
        css={css`
          height: calc(100vh - 226px);
          overflow: auto;
        `}
      >
        {/* TODO：虚拟列表 */}
        {casesResults}
      </EmptyWrapper>
    </div>
  );
};

export default BatchRun;
