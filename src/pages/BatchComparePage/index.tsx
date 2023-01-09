import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Button, Tree, TreeProps } from 'antd';
import { DataNode } from 'antd/es/tree';

import axios from '../../helpers/api/axios';
const treeData: DataNode[] = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        disabled: true,
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
            disableCheckbox: true,
          },
          {
            title: 'leaf',
            key: '0-0-0-1',
          },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [{ title: <span style={{ color: '#1890ff' }}>sss</span>, key: '0-0-1-0' }],
      },
    ],
  },
];
const BatchComparePage = () => {
  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  };

  const { data, loading } = useRequest(
    () => {
      return axios
        .post('/report/compare/quickCompare', {
          msgCombination: {
            baseMsg: JSON.stringify({ name: 'zt' }),
            testMsg: JSON.stringify({ name: 'wp' }),
          },
        })
        .then((res) => {
          const rows = res.body.diffDetails || [];
          return rows.map((r) => r.logs[0]);
        });
    },
    {
      refreshDeps: [],
    },
  );

  return (
    <div>
      <div
        css={css`
          display: flex;
        `}
      >
        <div>
          <Tree
            checkable
            defaultExpandedKeys={['0-0-0', '0-0-1']}
            defaultSelectedKeys={['0-0-0', '0-0-1']}
            defaultCheckedKeys={['0-0-0', '0-0-1']}
            onSelect={onSelect}
            onCheck={onCheck}
            treeData={treeData}
          />
        </div>
        <div>
          <Button>Run</Button>
        </div>
      </div>

      <div>{JSON.stringify(data)}</div>
    </div>
  );
};

export default BatchComparePage;
