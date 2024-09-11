import { Card } from 'antd';
import * as React from 'react';
import { ReactElement } from 'react';

import { CollectionNodeType } from '@/constant';
import { RunResult } from '@/panes/BatchRun/BatchRun';
import { GroupProps } from '@/panes/BatchRun/BatchRunResultGroup/common';

function groupByInterface(blockMap: Map<RunResult, ReactElement>) {
  const interfaceMap = new Map<string, RunResult[]>();
  for (const runResult of blockMap.keys()) {
    const request = runResult.request;
    const parent = request.parentPath[request.parentPath.length - 1];
    if (parent.nodeType !== CollectionNodeType.interface) {
      interfaceMap.set(request.id, [runResult]);
    }
  }
  for (const runResult of blockMap.keys()) {
    const parent = runResult.request.parentPath[runResult.request.parentPath.length - 1];
    if (parent.nodeType === CollectionNodeType.interface) {
      interfaceMap.get(parent.id)?.push(runResult);
    }
  }
  return interfaceMap;
}

export function ByInterface(props: GroupProps) {
  const { blockMap } = props;
  // console.log(blockMap);
  const interfaceMap = groupByInterface(blockMap);
  // console.log(interfaceMap.values());
  return (
    <div style={{ maxHeight: 350, overflowY: 'scroll' }}>
      {Array.from(interfaceMap.values()).map((casesOfInterface) => {
        const interfaceItem = casesOfInterface[0];
        return (
          <Card
            style={{ marginBottom: 8 }}
            size='small'
            key={interfaceItem.request.id}
            title={interfaceItem.request.name}
          >
            <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
              {casesOfInterface.map((runResult) => {
                return blockMap.get(runResult);
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
