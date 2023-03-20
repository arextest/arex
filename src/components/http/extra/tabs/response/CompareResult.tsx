// @ts-nocheck
import { css } from '@emotion/react';
import { Spin } from 'antd';
import React, { useState } from 'react';

import { DiffJsonViewProps } from '../../../../replay/Analysis';
import DiffJsonViewDrawer from '../../../../replay/Analysis/DiffJsonView/DiffJsonViewDrawer';
import DiffList from '../../../../replay/Analysis/DiffList';

const CompareResult = ({ compareResult, loading }) => {
  const [diffJsonViewData, setDiffJsonViewData] = useState<DiffJsonViewProps['data']>();
  const [diffJsonViewVisible, setDiffJsonViewVisible] = useState(false);
  return (
    <div
      css={css`
        height: 100%;
        overflow: auto;
      `}
    >
      <Spin spinning={loading}>
        <h4
          css={css`
            padding: 10px;
          `}
        >
          Compare Result
        </h4>
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
        <DiffJsonViewDrawer
          data={diffJsonViewData}
          open={diffJsonViewVisible}
          onClose={() => setDiffJsonViewVisible(false)}
        />
      </Spin>
    </div>
  );
};

export default CompareResult;
