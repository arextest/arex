import { useEffect, useState } from 'react';

import { FileSystemService } from '../../../../services/FileSystem.service';
import { calcProgressDetail } from '../helper';

const useQueryBatchCompareProgress = ({ planId }: any) => {
  const [data, setData] = useState<any>();
  const run = (planId: any) =>
    FileSystemService.queryBatchCompareProgress({ planId })
      .then((res: any) => {
        setData(res);
        return res.map((r: any) => calcProgressDetail(r.statusList));
      })
      .catch((err) => {
        setData([]);
        return [];
      });
  // TODO 检查所有的状态，暂停轮训
  useEffect(() => {
    run(planId);
  }, []);
  return {
    data: data,
    run: run,
  };
};

export default useQueryBatchCompareProgress;
