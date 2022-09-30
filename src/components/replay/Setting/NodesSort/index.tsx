import { Col, Row, Select } from 'antd';
import React, { FC, useMemo, useState } from 'react';
import { useImmer } from 'use-immer';

import { tryParseJsonString } from '../../../../utils';
import { IgnoredNodesEditMode } from '../NodesIgnore';
import EditAreaPlaceholder from '../NodesIgnore/EditAreaPlaceholder';
import ResponseRaw from '../NodesIgnore/ResponseRaw';
import PathCollapse from './PathCollapse';
import ResponseTree from './ResponseTree';

const MockInterfaces = ['/owners', '/owners/find'];
const MockResponse = {
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
  { label: 'Tree', value: IgnoredNodesEditMode.Tree },
  { label: 'Raw', value: IgnoredNodesEditMode.Raw },
];

const NodesSort: FC = () => {
  const [rawResponse, setRawResponse] = useState<object>(MockResponse);
  const rawResponseString = useMemo(() => JSON.stringify(rawResponse, null, 2), [rawResponse]);

  const [activeKey, setActiveKey] = useState<string>();
  const [activeCollapseKey, setActiveCollapseKey] = useState<string>();

  const [ignoredNodesEditMode, setIgnoredNodesEditMode] = useState<IgnoredNodesEditMode>(
    IgnoredNodesEditMode.Tree,
  );
  const [checkedNodes, setCheckedNodes] = useImmer<{ [key: string]: string[] }>({});

  const onCheck = (key: string | undefined, selected: string[]) => {
    key &&
      setCheckedNodes((state) => {
        state[key] = selected;
      });
  };

  const handleResponseRawSave = (value?: string) => {
    if (value) {
      const res = tryParseJsonString(value);
      res && setRawResponse(res);
      setIgnoredNodesEditMode(IgnoredNodesEditMode.Tree);
    }
  };

  const handleIgnoredNodesCollapseClick = (key?: string) =>
    setActiveKey(key === activeKey ? undefined : key);

  const handleCollapseItemEdit = (path: string, key: string) =>
    setActiveCollapseKey(`${path}_${key}`);

  return (
    <>
      <Row gutter={24} style={{ margin: 0, flexWrap: 'nowrap' }}>
        <Col span={14}>
          <h3>Interfaces</h3>
          <PathCollapse
            interfaces={MockInterfaces}
            activeKey={activeKey}
            activeCollapseKey={activeCollapseKey}
            checkedNodes={checkedNodes}
            onEdit={handleCollapseItemEdit}
            onChange={handleIgnoredNodesCollapseClick}
            onDelete={onCheck}
          />
        </Col>

        <Col span={10}>
          {activeKey ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>Response {ignoredNodesEditMode}</h3>
                <Select
                  bordered={false}
                  options={ignoredNodesEditModeOptions}
                  value={ignoredNodesEditMode}
                  onChange={setIgnoredNodesEditMode}
                />
              </div>

              {ignoredNodesEditMode === IgnoredNodesEditMode.Tree ? (
                <ResponseTree
                  exclude='object'
                  title={activeKey}
                  treeData={rawResponse}
                  checkedKeys={checkedNodes[activeKey]}
                  onCheck={(checkedKeys, info) =>
                    onCheck(
                      activeKey,
                      info.checkedNodes.map((node) => node.key.toString()),
                    )
                  }
                />
              ) : (
                <ResponseRaw value={rawResponseString} onSave={handleResponseRawSave} />
              )}
            </>
          ) : (
            <EditAreaPlaceholder />
          )}
        </Col>
      </Row>
    </>
  );
};

export default NodesSort;
