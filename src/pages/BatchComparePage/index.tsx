import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Allotment } from 'allotment';
import { Button, Divider, Spin, Table, Tag, Tree } from 'antd';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { DiffJsonView, DiffJsonViewProps } from '../../components/replay/Analysis';
import DiffList from '../../components/replay/Analysis/DiffList';
import { genCaseTreeData } from '../../helpers/BatchRun/util';
import { treeFind } from '../../helpers/collection/util';
import { FileSystemService } from '../../services/FileSystem.service';
import { useStore } from '../../store';
import { checkResponsesIsJson, getBatchCompareResults } from './util';

const ExpandedRowRender = ({ record }) => {
  const [diffJsonViewData, setDiffJsonViewData] = useState<DiffJsonViewProps['data']>();

  const [diffJsonViewVisible, setDiffJsonViewVisible] = useState(false);
  const { data, loading } = useRequest(() => {
    return FileSystemService.queryCase({ id: record.id, getCompareMsg: true }).then((res) =>
      (res.comparisonMsg.diffDetails || []).map((r) => r.logs[0]),
    );
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
  const { t } = useTranslation(['common', 'page']);
  const { activeEnvironment } = useStore();
  const { collectionTreeData } = useStore();

  const params = useParams();
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
      title: t('case', { ns: 'common' }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('batchComparePage.result', { ns: 'page' }),
      dataIndex: 'diffResultCode',
      key: 'diffResultCode',
      render(_, record) {
        const result = { '0': 'success', '1': 'error', '2': 'error' }[record.diffResultCode];
        return <Tag color={result}>{result}</Tag>;
      },
    },
  ];
  const dataSource = useMemo(() => {
    return (data || []).map((i) => ({
      id: i.caseRequest.id,
      name: i.caseRequest.name,
      issues: 0,
      caseCompare: i.caseCompare,
      diffResultCode: i.caseCompare,
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
              flex: 1;
            `}
          >
            <Button
              type={'primary'}
              onClick={() => {
                run();
              }}
            >
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
