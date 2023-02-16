import { css } from '@emotion/react';
import { useMount } from 'ahooks';
import { Allotment } from 'allotment';
import { Button, Divider, Progress, Table, Tree } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { genCaseTreeData } from '../../../helpers/BatchRun/util';
import { treeFind } from '../../../helpers/collection/util';
import { useStore } from '../../../store';
import DiffCard from './DiffCard';
import { calcProgress } from './helper';
import useBatchCompareResults, { genCaseStructure } from './hooks/useBatchCompareResults';
import useQueryBatchCompareProgress from './hooks/useQueryBatchCompareProgress';

const BatchComparePage = () => {
  // const [planId, setPlanId] = useState<string>('');
  const { t } = useTranslation(['common', 'page']);
  const { activeEnvironment } = useStore();
  const { collectionTreeData } = useStore();

  const params = useParams();
  const planId = params.rawId;
  // 生成caseTree数据
  const caseTreeData = useMemo(() => {
    if (params.pagesType === 'BatchComparePage') {
      if (params.rawId && params.rawId.length === 24) {
        return genCaseTreeData([treeFind(collectionTreeData, (node) => node.key === params.rawId)]);
      } else {
        return genCaseTreeData(collectionTreeData);
      }
    } else {
      return [];
    }
  }, [collectionTreeData, params.rawId, params.pagesType]);
  const [checkValue, setCheckValue] = useState<string[]>([]);
  const onCheck: any = (checkedKeys: string[]) => {
    setCheckValue(checkedKeys);
  };
  const columns = [
    {
      title: 'Interface Id',
      dataIndex: 'interfaceId',
      key: 'interfaceId',
    },
    {
      title: 'Interface',
      dataIndex: 'interfaceName',
      key: 'interfaceName',
    },

    {
      title: '进度',
      dataIndex: 'statusList',
      key: 'statusList',
      render(_: any, record: any) {
        return (
          <div>
            <Progress percent={calcProgress(record.statusList) * 100} />
          </div>
        );
      },
    },
  ];
  const caseStructure = useMemo(() => {
    return genCaseStructure(checkValue, collectionTreeData);
  }, [checkValue, collectionTreeData]);
  const { data: testData, run: testRun } = useBatchCompareResults(
    caseStructure,
    collectionTreeData,
    activeEnvironment?.keyValues || [],
    planId,
  );
  const { data, run: runQueryBatchCompareProgress } = useQueryBatchCompareProgress({
    planId: planId,
  });
  const [timer, setTimer] = useState<any>(-1);
  useEffect(() => {
    clearInterval(timer);
    const interval = setInterval(() => {
      runQueryBatchCompareProgress(planId);
    }, 3000);
    setTimer(interval);
    return () => clearInterval(interval);
  }, [planId]);
  return (
    <Allotment
      css={css`
        height: 100%;
      `}
      vertical={true}
    >
      <Allotment.Pane preferredSize={360}>
        <div
          css={css`
            height: 100%;
            display: flex;
          `}
        >
          <div
            css={css`
              flex: 1;
              height: 100%;
              overflow-y: scroll;
            `}
          >
            <p
              css={css`
                font-weight: bolder;
              `}
            >
              {t('batchComparePage.select_need_compare_case', { ns: 'page' })}
            </p>
            <Tree
              checkable
              checkedKeys={checkValue}
              onCheck={onCheck}
              defaultExpandedKeys={['ROOT']}
              treeData={[
                {
                  title: 'ROOT',
                  key: 'ROOT',
                  children: caseTreeData,
                },
              ]}
            />
          </div>
          <div
            css={css`
              width: 50px;
            `}
          >
            <Divider
              type={'vertical'}
              css={css`
                height: 100%;
              `}
            />
          </div>

          <div
            css={css`
              flex: 0.3;
            `}
          >
            <Button type={'primary'} onClick={testRun}>
              {t('batchComparePage.run_compare', { ns: 'page' })}
            </Button>
          </div>
        </div>
      </Allotment.Pane>
      <Allotment.Pane>
        <div
          css={css`
            overflow-y: scroll;
            height: 100%;
            padding-top: 10px;
          `}
        >
          <h3>{t('batchComparePage.compare_results', { ns: 'page' })}</h3>
          <Table
            columns={columns}
            dataSource={data}
            expandable={{
              expandedRowRender: (record) => {
                return (
                  <div style={{ margin: 0 }}>
                    <DiffCard planId={planId} interfaceId={record.interfaceId} />
                  </div>
                );
              },
              rowExpandable: (record) => record.name !== 'Not Expandable',
            }}
          />
        </div>
      </Allotment.Pane>
    </Allotment>
  );
};

export default BatchComparePage;
