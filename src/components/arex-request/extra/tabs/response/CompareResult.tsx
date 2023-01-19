import { Spin } from 'antd';
import React, { useState } from 'react';

import { DiffJsonView, DiffJsonViewProps } from '../../../../replay/Analysis';
import DiffList from '../../../../replay/Analysis/DiffList';

const CompareResult = ({ compareResult, loading }) => {
  const [diffJsonViewData, setDiffJsonViewData] = useState<DiffJsonViewProps['data']>();
  const [diffJsonViewVisible, setDiffJsonViewVisible] = useState(false);
  return (
    <Spin spinning={loading}>
      <DiffList
        externalData={{
          logs: compareResult.logs,
          baseMsg: JSON.stringify(compareResult.responses[0]),
          testMsg: JSON.stringify(compareResult.responses[1]),
        }}
        appId={''}
        operationId={''}
        onTreeModeClick={(diff) => {
          if (diff) {
            setDiffJsonViewData({
              baseMsg: diff.baseMsg,
              testMsg: diff.testMsg,
              logs: diff.logs,
            });
            setDiffJsonViewVisible(true);
          }
        }}
      />
      <DiffJsonView
        data={diffJsonViewData}
        open={diffJsonViewVisible}
        onClose={() => setDiffJsonViewVisible(false)}
      />
    </Spin>
  );
};

export default CompareResult;
