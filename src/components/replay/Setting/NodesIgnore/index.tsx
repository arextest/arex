import { Button, Col, Row, Select } from 'antd';
import React, { FC, useMemo, useState } from 'react';
import { useImmer } from 'use-immer';

import { tryParseJsonString } from '../../../../utils';
import EditAreaPlaceholder from './EditAreaPlaceholder';
import IgnoreTree from './IgnoreTree';
import PathCollapse, { GLOBAL_KEY } from './PathCollapse';
import ResponseRaw from './ResponseRaw';

enum NodesEditMode {
  'Tree' = 'Tree',
  'Raw' = 'Raw',
}

const MockInterfaces = ['/owners', '/owners/find'];
const MockResponse = {
  parent1: { child1: { bar: '1' }, child2: '2', numberArray: [1, 2, 3] },
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

const NodesIgnore: FC = () => {
  const [checkedNodesData, setCheckedNodesData] = useImmer<{
    global: string[];
    interfaces: { [key: string]: string[] };
  }>({
    global: [],
    interfaces: {},
  });

  const [rawResponse, setRawResponse] = useState<object>(MockResponse);
  const rawResponseString = useMemo(() => JSON.stringify(rawResponse, null, 2), [rawResponse]);

  const [activeKey, setActiveKey] = useState<string>();
  const [ignoredNodesEditMode, setIgnoredNodesEditMode] = useState<NodesEditMode>(
    NodesEditMode.Tree,
  );

  const onSelect = (key: string | undefined, selected: string[]) => {
    setCheckedNodesData((state) => {
      if (key === GLOBAL_KEY) {
        state.global = selected;
      } else if (key) {
        state.interfaces[key] = selected;
      }
    });
  };

  const handleIgnoredNodesCollapseClick = (key?: string) => {
    setActiveKey(key === activeKey ? undefined : key);
  };

  const handleResponseRawSave = (value?: string) => {
    if (value) {
      const res = tryParseJsonString(value);
      res && setRawResponse(res);
      setIgnoredNodesEditMode(NodesEditMode.Tree);
    }
  };

  const handleSave = () => {
    console.log('save', checkedNodesData);
  };
  return (
    <>
      <Row justify='space-between' style={{ margin: 0, flexWrap: 'nowrap' }}>
        <Col span={13}>
          <h3>Global</h3>
          <PathCollapse
            activeKey={activeKey}
            checkedNodes={checkedNodesData.global}
            onChange={handleIgnoredNodesCollapseClick}
            onSelect={onSelect}
          />

          <br />

          <h3>Interfaces</h3>
          <PathCollapse
            interfaces={MockInterfaces}
            activeKey={activeKey}
            checkedNodes={checkedNodesData.interfaces}
            onChange={handleIgnoredNodesCollapseClick}
            onSelect={onSelect}
          />
        </Col>

        <Col span={10}>
          {activeKey ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>{ignoredNodesEditMode}</h3>
                <Select
                  bordered={false}
                  options={ignoredNodesEditModeOptions}
                  value={ignoredNodesEditMode}
                  onChange={setIgnoredNodesEditMode}
                />
              </div>

              {ignoredNodesEditMode === NodesEditMode.Tree ? (
                <IgnoreTree
                  treeData={rawResponse}
                  selectedKeys={
                    activeKey === GLOBAL_KEY
                      ? checkedNodesData.global
                      : checkedNodesData.interfaces[activeKey]
                  }
                  title={activeKey}
                  exclude='array'
                  onSelect={(selectKeys, info) =>
                    onSelect(
                      activeKey,
                      info.selectedNodes.map((node) => node.key.toString()),
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

      <Button type='primary' onClick={handleSave} style={{ float: 'right', marginTop: '16px' }}>
        Save
      </Button>
    </>
  );
};

export default NodesIgnore;
