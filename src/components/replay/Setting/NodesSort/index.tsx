import { Button, Col, Row, Select } from 'antd';
import React, { FC, useMemo, useState } from 'react';
import { useImmer } from 'use-immer';

import { tryParseJsonString } from '../../../../utils';
import EditAreaPlaceholder from '../NodesIgnore/EditAreaPlaceholder';
import ResponseRaw from '../NodesIgnore/ResponseRaw';
import ArrayTree from './ArrayTree';
import PathCollapse from './PathCollapse';
import SortTree from './SortTree';

enum NodesEditMode {
  'Tree' = 'Tree',
  'Raw' = 'Raw',
}

enum TreeEditMode {
  'ArrayTree' = 'ArrayTree',
  'SortTree' = 'SortTree',
}

const MockInterfaces = ['/owners', '/owners/find'];
const MockResponse: { [key: string]: any } = {
  parent1: { child1: { bar: '1' }, child2: '2' },
  numberArray: [1, 2, 3],
  stringArray: ['a', 'b', 'c'],
  objectArray: [
    {
      number: 1,
      string: 'a',
      object: {
        number: 11,
        string: 'aa',
      },
    },
    {
      number: 2,
      string: 'b',
      object: {
        number: 22,
        string: 'bb',
      },
    },
  ],
};

const ignoredNodesEditModeOptions = [
  { label: 'Tree', value: NodesEditMode.Tree },
  { label: 'Raw', value: NodesEditMode.Raw },
];

const NodesSort: FC = () => {
  const [rawResponse, setRawResponse] = useState<object>(MockResponse);
  const rawResponseString = useMemo(() => JSON.stringify(rawResponse, null, 2), [rawResponse]);

  const [activeKey, setActiveKey] = useState<string>();
  const [activeCollapseKey, setActiveCollapseKey] = useState<string>();

  const [nodesEditMode, setNodesEditMode] = useState<NodesEditMode>(NodesEditMode.Tree);
  const [treeEditMode, setTreeEditMode] = useState<TreeEditMode>(TreeEditMode.ArrayTree);

  const [checkedNodesData, setCheckedNodesData] = useImmer<{
    [key: string]: // interface
    {
      [key: string]: // path
      string[];
    }; // sorted keys
  }>({});

  const [sortArray, setSortArray] = useState<any[]>();
  const handleArrayTreeChecked = (key: string | undefined, checked: string[]) => {
    key &&
      setCheckedNodesData((state) => {
        !state[key] && (state[key] = {});
        const keys = Object.keys(state[key]);
        checked.forEach((k) => {
          !keys.includes(k) && (state[key][k] = []);
        });
      });
  };

  const handleSortTreeChecked = (checked: string[]) => {
    activeKey &&
      activeCollapseKey &&
      setCheckedNodesData((state) => {
        state[activeKey][activeCollapseKey] = checked;
      });
  };

  const handleResponseRawSave = (value?: string) => {
    if (value) {
      const res = tryParseJsonString(value);
      res && setRawResponse(res);
      setNodesEditMode(NodesEditMode.Tree);
      setTreeEditMode(TreeEditMode.ArrayTree);
    }
  };

  const handleIgnoredNodesCollapseClick = (key?: string, maintain?: boolean) => {
    setNodesEditMode(NodesEditMode.Tree);
    setTreeEditMode(TreeEditMode.ArrayTree);
    setActiveKey(key !== activeKey || maintain ? key : undefined);
    key && handleSetSortArray(key);
  };

  const handleEditCollapseItem = (key?: string) => {
    setNodesEditMode(NodesEditMode.Tree);
    setTreeEditMode(TreeEditMode.SortTree);
    if (key) {
      setActiveCollapseKey(key);
      handleSetSortArray(key);
    }
  };

  const handleDeleteCollapseItem = (key: string) => {
    activeKey &&
      setCheckedNodesData((state) => {
        delete state[activeKey][key];
      });
  };

  // 获取待排序操作的数组结构
  const handleSetSortArray = (key: string) => {
    let value = undefined;
    key
      .split('/')
      .filter(Boolean)
      .forEach((k) => {
        value = MockResponse[k];
      });
    setSortArray(value);
  };

  const handleSave = () => {
    console.log('save', checkedNodesData);
  };

  return (
    <>
      <Row justify='space-between' style={{ margin: 0, flexWrap: 'nowrap' }}>
        <Col span={13}>
          <h3>Interfaces</h3>
          <PathCollapse
            interfaces={MockInterfaces}
            activeKey={activeKey}
            activeCollapseKey={activeCollapseKey}
            checkedNodes={checkedNodesData}
            onEdit={handleEditCollapseItem}
            onChange={handleIgnoredNodesCollapseClick}
            onDelete={handleDeleteCollapseItem}
          />
        </Col>

        <Col span={10}>
          {activeKey ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>{nodesEditMode}</h3>
                <Select
                  bordered={false}
                  options={ignoredNodesEditModeOptions}
                  value={nodesEditMode}
                  onChange={setNodesEditMode}
                />
              </div>

              {nodesEditMode === NodesEditMode.Tree ? (
                treeEditMode === TreeEditMode.SortTree ? (
                  <SortTree
                    title={activeCollapseKey}
                    treeData={sortArray}
                    checkedKeys={checkedNodesData[activeKey][activeCollapseKey as string]}
                    onCheck={(checkedKeys, info) =>
                      handleSortTreeChecked(info.checkedNodes.map((node) => node.key.toString()))
                    }
                  />
                ) : (
                  <ArrayTree
                    exclude='object'
                    title={activeKey}
                    treeData={rawResponse}
                    checkedKeys={Object.keys(checkedNodesData[activeKey] || {})}
                    selectedKeys={[activeCollapseKey as string]}
                    onSelect={(selectedKeys, info) => {
                      // 选中待排序数组对象
                      handleEditCollapseItem(info.selectedNodes[0].key.toString());
                    }}
                    onCheck={(checkedKeys, info) =>
                      handleArrayTreeChecked(
                        activeKey,
                        info.checkedNodes.map((node) => node.key.toString()),
                      )
                    }
                  />
                )
              ) : (
                <ResponseRaw value={rawResponseString} onSave={handleResponseRawSave} />
              )}
            </>
          ) : (
            <EditAreaPlaceholder />
          )}
        </Col>
      </Row>

      <Button type='primary' onClick={handleSave} style={{ float: 'right', marginTop: '16px' }}>
        Save
      </Button>
    </>
  );
};

export default NodesSort;
