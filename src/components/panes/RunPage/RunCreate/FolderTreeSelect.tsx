import { css, useTheme } from '@emotion/react';
import { Button, Space, Tree } from 'antd';
import { DataNode } from 'antd/es/tree';
import { Divider } from 'antd/lib';
import { forwardRef, Key, useImperativeHandle, useState } from 'react';

import { genCaseTreeData } from '../../../../helpers/BatchRun/util';
import { treeFind, treeFindAllKeys } from '../../../../helpers/collection/util';
import { useCustomSearchParams } from '../../../../router/useCustomSearchParams';
import { useStore } from '../../../../store';
import { genCaseStructure } from '../../BatchComparePage/hooks/useBatchCompareResults';

interface FolderTreeSelectProps {
  name: string;
}
export interface FolderTreeSelectRef {
  getBatchCompareReportParams: () => void;
}

const FolderTreeSelect = forwardRef<FolderTreeSelectRef, FolderTreeSelectProps>(({ name }, ref) => {
  useImperativeHandle(ref, () => ({
    getBatchCompareReportParams: () => {
      return genCaseStructure(checkedKeys, collectionTreeData);
    },
  }));

  const { collectionTreeData } = useStore();
  const customSearchParams = useCustomSearchParams();
  const theme = useTheme();
  const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
  const testData: DataNode[] = customSearchParams?.query?.folderId
    ? genCaseTreeData([
        treeFind(collectionTreeData, (node) => node.key === customSearchParams.query.folderId),
      ])
    : genCaseTreeData(collectionTreeData);
  return (
    <div
      style={{ flex: '1' }}
      css={css`
        padding: 12px;
        padding-right: 0;
        display: flex;
        flex-direction: column;
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        `}
      >
        <span
          css={css`
            font-weight: 600;
          `}
        >
          RUN ORDER
        </span>
        <Space size={0}>
          <Button
            type={'link'}
            onClick={() => {
              setCheckedKeys([]);
            }}
          >
            Deselect All
          </Button>
          <Divider type={'vertical'} />
          <Button
            type={'link'}
            onClick={() => {
              setCheckedKeys(treeFindAllKeys(testData));
            }}
          >
            Select All
          </Button>
        </Space>
      </div>

      <div
        css={css`
          padding-top: 10px;
          flex: 1;
          border: 1px solid ${theme.colorBorder};
          border-radius: ${theme.borderRadius}px;
          overflow-y: auto;
          .ant-checkbox-wrapper.ant-checkbox-group-item {
            padding: 5px 10px;
            &:hover {
              background-color: rgba(0, 0, 0, 0.1);
            }
          }
          .ant-checkbox-wrapper.ant-checkbox-group-item:nth-of-type(1) {
            margin-inline-start: 8px;
          }
        `}
      >
        <Tree
          checkedKeys={checkedKeys}
          onCheck={(cKeys: any) => {
            setCheckedKeys(cKeys);
          }}
          css={css`
            display: grid;
          `}
          checkable={true}
          treeData={testData}
        />
      </div>
    </div>
  );
});

export default FolderTreeSelect;
