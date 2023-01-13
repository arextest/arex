import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Allotment } from 'allotment';
import { Button, Divider, Spin, Table, Tree } from 'antd';
import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { DiffJsonView, DiffJsonViewProps } from '../../components/replay/Analysis';
import DiffList from '../../components/replay/Analysis/DiffList';
import axios from '../../helpers/api/axios';
import { genCaseTreeData } from '../../helpers/BatchRun/util';
import { treeFind } from '../../helpers/collection/util';
import { useStore } from '../../store';
import { checkResponsesIsJson, getBatchCompareResults } from './util';

const ExpandedRowRender = ({ record }) => {
  const [diffJsonViewData, setDiffJsonViewData] = useState<DiffJsonViewProps['data']>();

  const [diffJsonViewVisible, setDiffJsonViewVisible] = useState(false);
  const { data, loading } = useRequest(() => {
    return axios
      .post('/report/compare/quickCompare', {
        msgCombination: {
          baseMsg: JSON.stringify(record.compareResult.responses[0]),
          testMsg: JSON.stringify(record.compareResult.responses[1]),
          comparisonConfig: record.comparisonConfig,
        },
      })
      .then((res) => {
        const rows = res.body.diffDetails || [];
        return rows.map((r) => r.logs[0]);
      });
  });
  return (
    <Spin spinning={loading}>
      {checkResponsesIsJson(record.compareResult.responses) ? (
        <DiffList
          externalData={{
            logs: data || [],
            baseMsg: JSON.stringify(record.compareResult.responses[0]),
            testMsg: JSON.stringify(record.compareResult.responses[1]),
          }}
          appId={''}
          operationId={''}
          onTreeModeClick={(diff) => {
            if (diff) {
              setDiffJsonViewData({
                baseMsg: diff.baseMsg,
                testMsg: diff.testMsg,
                logs: diff.logs,
              });
              setDiffJsonViewVisible(true);
            }
          }}
        />
      ) : null}

      <DiffJsonView
        data={diffJsonViewData}
        open={diffJsonViewVisible}
        onClose={() => setDiffJsonViewVisible(false)}
      />
    </Spin>
  );
};
const BatchComparePage = () => {
  const { activeEnvironment } = useStore();
  const { collectionTreeData } = useStore();

  const params = useParams();
  // 生成caseTree数据
  const caseTreeData = useMemo(() => {
    if (params.rType === 'BatchComparePage') {
      if (params.rTypeId && params.rTypeId.length === 24) {
        return genCaseTreeData([
          treeFind(collectionTreeData, (node) => node.key === params.rTypeId),
        ]);
      } else {
        return genCaseTreeData(collectionTreeData);
      }
    } else {
      return [];
    }
  }, [collectionTreeData, params.rTypeId, params.rType]);
  const [checkValue, setCheckValue] = useState<string[]>([]);
  const onCheck = (checkedKeys: string[]) => {
    setCheckValue(checkedKeys);
  };
  const { data, loading, run } = useRequest(
    () =>
      getBatchCompareResults(
        checkValue.filter(
          (c) => treeFind(collectionTreeData, (node) => node.key === c)?.nodeType === 2,
        ),
        activeEnvironment?.keyValues || [],
        collectionTreeData,
      ),
    {
      manual: true,
    },
  );

  const columns = [
    {
      title: 'Case',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Issues',
      dataIndex: 'issues',
      key: 'issues',
    },
  ];
  const dataSource = useMemo(() => {
    return (data || []).map((i) => ({
      id: i.caseRequest.id,
      name: i.caseRequest.name,
      issues: 0,
      caseCompare: i.caseCompare,
      compareResult: i.compareResult,
      comparisonConfig: i.comparisonConfig,
    }));
  }, [data]);
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
              Select need compare case
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
              flex: 1;
            `}
          >
            <Button
              type={'primary'}
              onClick={() => {
                run();
              }}
            >
              Run Compare
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
          <h3>Compare results</h3>
          <Table
            size={'small'}
            bordered
            rowKey={'id'}
            expandable={{
              expandedRowRender: (record) => <ExpandedRowRender record={record} />,
            }}
            loading={loading}
            columns={columns}
            dataSource={dataSource}
          />
        </div>
      </Allotment.Pane>
    </Allotment>
  );
};

export default BatchComparePage;
