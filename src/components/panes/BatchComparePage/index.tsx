import { css } from '@emotion/react';
import { Allotment } from 'allotment';
import { Button, Divider, Table, Tree } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { genCaseTreeData } from '../../../helpers/BatchRun/util';
import { treeFind } from '../../../helpers/collection/util';
import { uuid } from '../../../helpers/utils';
import { useStore } from '../../../store';
import StatusTag from '../../replay/StatusTag';
import DiffCard from './DiffCard';
import { calcProgressDetail } from './helper';
import useBatchCompareResults, { genCaseStructure } from './hooks/useBatchCompareResults';
import useQueryBatchCompareProgress from './hooks/useQueryBatchCompareProgress';

const BatchComparePage = () => {
  const { t } = useTranslation(['common', 'page']);
  const { activeEnvironment } = useStore();
  const { collectionTreeData } = useStore();

  const params = useParams();
  const nav = useNavigate();
  const loc = useLocation();

  const [searchParams] = useSearchParams();
  const planId = searchParams.get('planId');

  useEffect(() => {
    if (!searchParams.get('planId') && params.pagesType) {
      const u = uuid();
      nav(`${loc.pathname}?planId=${u}`);
    }
  }, [loc]);

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
      title: 'Interface',
      dataIndex: 'interfaceName',
      key: 'interfaceName',
    },
    ...[
      // { label: 'Init' },
      // { label: 'Wait' },
      { label: 'Success' },
      { label: 'Fail' },
      { label: 'Exception' },
    ].map((i, index) => {
      return {
        title: i.label,
        dataIndex: 'statusList',
        key: i.label,
        render(_: any): JSX.Element {
          return (
            <div>
              {_.find((r: any) => {
                return r.status === index + 2;
              })?.count || 0}
            </div>
          );
        },
      };
    }),

    // 0:初始、1:等待比较、2：成功、3:失败、4：异常
    {
      title: 'Status',
      dataIndex: 'statusList',
      key: 'statusList',
      render(_: any, record: any) {
        const data = calcProgressDetail(record.statusList);
        return (
          <StatusTag
            status={data.status}
            caseCount={data.successCaseCount}
            totalCaseCount={data.totalCaseCount}
          />
        );
      },
    },
  ];
  const caseStructure = useMemo(() => {
    return genCaseStructure(checkValue, collectionTreeData);
  }, [checkValue, collectionTreeData]);
  const { data: testData, run: testRun } = useBatchCompareResults(
    // caseStructure,
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
    runQueryBatchCompareProgress(planId);
    const interval = setInterval(() => {
      runQueryBatchCompareProgress(planId).then((runQueryBatchCompareProgressRes) => {
        const statusNoDoneLen = runQueryBatchCompareProgressRes.filter((f: any) => f.status !== 2);
        if (statusNoDoneLen.length === 0 && runQueryBatchCompareProgressRes.length > 0) {
          clearInterval(interval);
        }
      });
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
          ></div>
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
            rowKey={'interfaceId'}
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
