import { css } from '@emotion/react';
import { Result, Spin } from 'antd';
import { WritableDraft } from 'immer/dist/internal';
import React, { FC, useState } from 'react';

import { DiffJsonViewProps } from '../../../../DiffJsonView';
import DiffJsonViewDrawer from '../../../../DiffJsonView/DiffJsonViewDrawer';
import { DiffList } from '../../../../DiffList';

export type CompareResultProps = {
  compareResult: WritableDraft<{ logs: any[]; responses: any[] }>;
  loading: boolean;
};

const CompareResult: FC<CompareResultProps> = (props) => {
  const { compareResult, loading } = props;

  const [diffJsonViewData, setDiffJsonViewData] =
    useState<Pick<DiffJsonViewProps, 'diffJson' | 'diffPath'>>();
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
        {compareResult.logs.length > 0 || JSON.stringify(compareResult.responses[0]) === '{}' ? (
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
                  diffJson: {
                    left: String(diff.baseMsg) || '',
                    right: String(diff.testMsg) || '',
                  },
                  diffPath: diff.logs || [],
                });
                setDiffJsonViewVisible(true);
              }
            }}
          />
        ) : (
          <Result status='success' title='No differences found!' />
        )}
        <DiffJsonViewDrawer
          {...diffJsonViewData}
          open={diffJsonViewVisible}
          onClose={() => setDiffJsonViewVisible(false)}
        />
      </Spin>
    </div>
  );
};

export default CompareResult;
