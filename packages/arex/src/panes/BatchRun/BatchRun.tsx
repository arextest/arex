import { ArexPaneFC, EmptyWrapper } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { Button, Card, TreeSelect, Typography } from 'antd';
import { cloneDeep } from 'lodash';
import React, { Key, useMemo, useState } from 'react';

import BatchRunResultItem from '@/panes/BatchRun/BatchRunResultItem';
import { FileSystemService } from '@/services';
import { useCollections } from '@/store';
import { decodePaneKey } from '@/store/useMenusPanes';

import disabledNonCaseNode from './utils/disabledNonCaseNode';

const BatchRun: ArexPaneFC = (props) => {
  const { paneKey } = props;
  const { id } = useMemo(() => decodePaneKey(paneKey), [paneKey]);

  const { collectionsTreeData, collectionsFlatData } = useCollections();

  const [checkValue, setCheckValue] = useState<Key[]>([]);

  const treeData = useMemo(
    () =>
      disabledNonCaseNode(
        cloneDeep(
          id && id === 'root' ? collectionsTreeData : collectionsFlatData.get(id)?.children || [], // collection right click folder to batch run
        ),
      ),
    [collectionsTreeData],
  );

  const {
    data: cases = [],
    run: batchRun,
    loading,
  } = useRequest(() =>
    Promise.all(
      checkValue.map((key) => FileSystemService.queryRequest({ id: String(key), nodeType: 2 })),
    ),
  );

  return (
    <div>
      <Card>
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
          style={{ width: '85%' }}
        />
        <Button type='primary' onClick={batchRun} style={{ marginLeft: '16px' }}>
          Run
        </Button>
      </Card>

      <EmptyWrapper loading={loading} empty={!cases.length}>
        {cases.map((caseItem) => (
          <BatchRunResultItem key={caseItem.id} data={caseItem} />
        ))}
      </EmptyWrapper>
    </div>
  );
};

export default BatchRun;
