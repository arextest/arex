import { Spin } from 'antd';
import React, { useEffect, useState } from 'react';

import { FileSystemService } from '../../../services/FileSystem.service';
import { DiffJsonViewProps } from '../../replay/Analysis';
import BatchDiffList from '../../replay/Analysis/BatchDiffList';
import DiffJsonViewDrawer from '../../replay/Analysis/DiffJsonView/DiffJsonViewDrawer';

const DiffCard = (record: any) => {
  const { planId, interfaceId } = record;
  const [data, setData] = useState<any>([]);
  useEffect(() => {
    FileSystemService.queryBatchCompareSummary({
      planId: planId,
      interfaceId: interfaceId,
    }).then((res: any) => {
      setData(res.batchCompareSummaryItems);
    });
  }, [record]);

  const [diffJsonViewData, setDiffJsonViewData] = useState<DiffJsonViewProps['data']>();
  const [diffJsonViewVisible, setDiffJsonViewVisible] = useState(false);

  return (
    <div>
      <Spin spinning={false}>
        <BatchDiffList
          // @ts-ignore
          externalData={{
            logs: data.map((d: any) => d.logEntity),
            logIds: data.map((d: any) => d.logId),
            // @ts-ignore
            errorCount: data.map((d) => d.errorCount),
          }}
          appId={''}
          operationId={''}
          onTreeModeClick={(diff: any) => {
            console.log(diff, 'diff');
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

export default DiffCard;
