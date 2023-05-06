import { Collapse } from 'antd';
import { DiffJsonView } from 'arex-core';
import React, { FC } from 'react';

import { RecordResult } from '@/services/StorageService';

const { Panel } = Collapse;

type CaseDetailTabProps = {
  type: string;
  compareResults?: RecordResult[];
};

const CaseDetailTab: FC<CaseDetailTabProps> = (props) => {
  return (
    <Collapse>
      {props.compareResults?.map((result, index) => (
        <Panel header={<span>{result.operationName}</span>} key={index}>
          <DiffJsonView
            height='400px'
            diffJson={{
              left: JSON.stringify(result.targetRequest, null, 2),
              right: JSON.stringify(result.targetResponse, null, 2),
            }}
          />
        </Panel>
      ))}
    </Collapse>
  );
};

export default CaseDetailTab;
