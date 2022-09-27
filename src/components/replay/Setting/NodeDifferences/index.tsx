import { css } from '@emotion/react';
import { Col, Collapse, List, Row, Select } from 'antd';
import React, { FC, useMemo, useState } from 'react';
import { useImmer } from 'use-immer';

import { tryParseJsonString } from '../../../../utils';
import ResponseRaw from './ResponseRaw';
import ResponseTree from './ResponseTree';

enum IgnoredNodesEditMode {
  'Tree' = 'Tree',
  'Raw' = 'Raw',
}

const MockInterfaces = ['/owners', '/owners/find'];

const data = { parent1: { child1: { bar: '1' }, child2: '2' }, parent2: { child3: '1' } };
const ignoredNodesEditModeOptions = [
  { label: 'Tree', value: IgnoredNodesEditMode.Tree },
  { label: 'Raw', value: IgnoredNodesEditMode.Raw },
];

const NodeDifferences: FC = () => {
  const [checkedNodes, setCheckedNodes] = useImmer<{
    global: string[];
    interfaces: { [key: string]: string[] };
  }>({
    global: [],
    interfaces: {},
  });

  const [rawResponse, setRawResponse] = useState<object>(data);
  const rawResponseString = useMemo(() => JSON.stringify(rawResponse, null, 2), [rawResponse]);

  const [activeKey, setActiveKey] = useState<string>();
  const [ignoredNodesEditMode, setIgnoredNodesEditMode] = useState<IgnoredNodesEditMode>(
    IgnoredNodesEditMode.Tree,
  );

  const onSelect = (key: string | undefined, selected: string[]) => {
    setCheckedNodes((state) => {
      if (key === '__global__') {
        state.global = selected;
      } else if (key) {
        state.interfaces[key] = selected;
      }
    });
  };

  const handleIgnoredNodesCollapseClick = (key?: string) => {
    console.log({ key });
    setActiveKey(key === activeKey ? undefined : key);
  };

  const handleResponseRawSave = (value?: string) => {
    if (value) {
      const res = tryParseJsonString(value);
      console.log(value, res);
      res && setRawResponse(res);
      setIgnoredNodesEditMode(IgnoredNodesEditMode.Tree);
    }
  };

  return (
    <Row gutter={24} style={{ margin: 0 }}>
      <Col span={14}>
        <h3>Global</h3>

        <Collapse
          activeKey={activeKey}
          css={css`
            .ant-collapse-content-box {
              padding: 0 !important;
            }
          `}
          onChange={() => handleIgnoredNodesCollapseClick('__global__')}
        >
          <Collapse.Panel
            key='__global__'
            header={<div>{`Ignored Nodes: ${checkedNodes['global'].length}`}</div>}
          >
            <List
              size='small'
              dataSource={checkedNodes['global']}
              renderItem={(item) => <List.Item>{item}</List.Item>}
              locale={{ emptyText: 'No Ignored Nodes' }}
            />
          </Collapse.Panel>
        </Collapse>

        <br />

        <h3>Interfaces</h3>
        <Collapse
          accordion
          activeKey={activeKey}
          css={css`
            .ant-collapse-content-box {
              padding: 0 !important;
            }
          `}
          onChange={(activeKey) => handleIgnoredNodesCollapseClick(activeKey as string)}
        >
          {MockInterfaces.map((item) => (
            <Collapse.Panel key={item} header={item}>
              <List
                size='small'
                dataSource={checkedNodes.interfaces[item]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
                locale={{ emptyText: 'No Ignored Nodes' }}
              />
            </Collapse.Panel>
          ))}
        </Collapse>
      </Col>

      {activeKey && (
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
                activeKey === '__global__'
                  ? checkedNodes.global
                  : checkedNodes.interfaces[activeKey]
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
      )}
    </Row>
  );
};

export default NodeDifferences;
