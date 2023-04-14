import { Spin } from 'antd';
import React, { FC, useState } from 'react';

import { FileSystemService } from '../../../services/FileSystem.service';
import { DiffJsonViewProps } from '../../DiffJsonView';
import DiffJsonViewDrawer from '../../DiffJsonView/DiffJsonViewDrawer';
import { BatchDiffList } from '../../DiffList';

export type DiffCardProps = {
  planId: string;
  interfaceId: string;
};
const DiffCard: FC<DiffCardProps> = (props) => {
  const { planId, interfaceId } = props;
  const [data, setData] = useState<any[]>([]);

  FileSystemService.queryBatchCompareSummary({
    planId: planId,
    interfaceId: interfaceId,
  }).then((res: any) => {
    setData(res.batchCompareSummaryItems);
  });

  const [diffJsonViewData, setDiffJsonViewData] =
    useState<Pick<DiffJsonViewProps, 'diffJson' | 'diffPath'>>();
  const [diffJsonViewVisible, setDiffJsonViewVisible] = useState(false);

  return (
    <div>
      <Spin spinning={false}>
        <BatchDiffList
          externalData={{
            logs: data.map((d: any) => d.logEntity),
            logIds: data.map((d: any) => d.logId),
            errorCount: data.map((d) => d.errorCount),
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

        <DiffJsonViewDrawer
          {...diffJsonViewData}
          open={diffJsonViewVisible}
          onClose={() => setDiffJsonViewVisible(false)}
        />
      </Spin>
    </div>
  );
};

export default DiffCard;
