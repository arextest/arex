import { DiffJsonView } from '@arextest/arex-core';
import { Collapse } from 'antd';
import React, { FC } from 'react';

import { RecordResult } from '@/services/StorageService';

type CaseDetailTabProps = {
  type: string;
  compareResults?: RecordResult[];
};

const CaseDetailTab: FC<CaseDetailTabProps> = (props) => {
  return (
    <Collapse
      items={props.compareResults?.map((result, index) => ({
        key: index,
        label: <span>{result.operationName}</span>,
        children: (
          <DiffJsonView
            height='400px'
            remark={['Request', 'Response']}
            diffJson={{
              left: JSON.stringify(result.targetRequest, null, 2),
              right: JSON.stringify(result.targetResponse, null, 2),
            }}
          />
        ),
      }))}
      style={{ marginTop: '8px' }}
    />
  );
};

export default CaseDetailTab;
