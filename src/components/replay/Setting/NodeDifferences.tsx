import { Card, Col, Row, Tree } from 'antd';
import { TreeProps } from 'antd/es';
import { DataNode } from 'antd/lib/tree';
import { FC, useState } from 'react';

const data = { parent1: { child1: { bar: '1' }, child2: '2' }, parent2: { child3: '1' } };

const NodeDifferences: FC = () => {
  const [checkedNodes, setCheckedNodes] = useState([]);

  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys.checked, info);
    setCheckedNodes(info.checkedNodes.map((node) => node.key));
  };

  function getNodes(object: object, basePath = ''): DataNode[] {
    return Object.entries(object).map(([key, value]) =>
      value && typeof value === 'object'
        ? { title: key, key: basePath + key + '/', children: getNodes(value, key + '/') }
        : { title: key, key: basePath + key + '/', value },
    );
  }

  return (
    <Row>
      <Col span={12}>
        <h3>Global</h3>
        <div>Ignored Nodes:</div>
        {checkedNodes.map((node, i) => (
          <div key={i}>{node}</div>
        ))}

        <br />

        <h3>Interfaces</h3>
      </Col>

      <Col span={12}>
        <Card title='Global (click node to ignore)'>
          <Tree
            checkable
            checkStrictly
            onSelect={onSelect}
            onCheck={onCheck}
            treeData={getNodes(data)}
            filterTreeNode={(node) => node.key === 'parent1/'}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default NodeDifferences;
