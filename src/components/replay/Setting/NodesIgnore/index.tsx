import { Col, Row, Select } from 'antd';
import React, { FC, useMemo, useState } from 'react';
import { useImmer } from 'use-immer';

import { tryParseJsonString } from '../../../../utils';
import EditAreaPlaceholder from './EditAreaPlaceholder';
import PathCollapse, { GLOBAL_KEY } from './PathCollapse';
import ResponseRaw from './ResponseRaw';
import ResponseTree from './ResponseTree';

enum IgnoredNodesEditMode {
  'Tree' = 'Tree',
  'Raw' = 'Raw',
}

const MockInterfaces = ['/owners', '/owners/find'];
const MockResponse = { parent1: { child1: { bar: '1' }, child2: '2' }, parent2: { child3: '1' } };

const ignoredNodesEditModeOptions = [
  { label: 'Tree', value: IgnoredNodesEditMode.Tree },
  { label: 'Raw', value: IgnoredNodesEditMode.Raw },
];

const NodesIgnore: FC = () => {
  const [checkedNodes, setCheckedNodes] = useImmer<{
    global: string[];
    interfaces: { [key: string]: string[] };
  }>({
    global: [],
    interfaces: {},
  });

  const [rawResponse, setRawResponse] = useState<object>(MockResponse);
  const rawResponseString = useMemo(() => JSON.stringify(rawResponse, null, 2), [rawResponse]);

  const [activeKey, setActiveKey] = useState<string>();
  const [ignoredNodesEditMode, setIgnoredNodesEditMode] = useState<IgnoredNodesEditMode>(
    IgnoredNodesEditMode.Tree,
  );

  const onSelect = (key: string | undefined, selected: string[]) => {
    setCheckedNodes((state) => {
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
      setIgnoredNodesEditMode(IgnoredNodesEditMode.Tree);
    }
  };

  return (
    <Row gutter={24} style={{ margin: 0, flexWrap: 'nowrap' }}>
      <Col span={14}>
        <h3>Global</h3>
        <PathCollapse
          activeKey={activeKey}
          checkedNodes={checkedNodes.global}
          onChange={handleIgnoredNodesCollapseClick}
          onSelect={onSelect}
        />

        <br />

        <h3>Interfaces</h3>
        <PathCollapse
          interfaces={MockInterfaces}
          activeKey={activeKey}
          checkedNodes={checkedNodes.interfaces}
          onChange={handleIgnoredNodesCollapseClick}
          onSelect={onSelect}
        />
      </Col>

      {activeKey ? (
        <Col span={10}>
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
              multiple
              treeData={rawResponse}
              selectedKeys={
                activeKey === GLOBAL_KEY ? checkedNodes.global : checkedNodes.interfaces[activeKey]
              }
              title={activeKey}
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
        </Col>
      ) : (
        <EditAreaPlaceholder />
      )}
    </Row>
  );
};

export default NodesIgnore;
