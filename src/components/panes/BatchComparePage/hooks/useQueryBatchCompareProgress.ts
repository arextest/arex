import { useEffect, useState } from 'react';

import { FileSystemService } from '../../../../services/FileSystem.service';

const useQueryBatchCompareProgress = ({ planId }: any) => {
  const [data, setData] = useState<any>();
  const run = (planId: any) =>
    FileSystemService.queryBatchCompareProgress({ planId })
      .then((res: any) => {
        setData(res);
      })
      .catch((err) => {
        setData([]);
      });
  useEffect(() => {
    run(planId);
  }, []);
  return {
    data: data,
    run: run,
  };
};

export default useQueryBatchCompareProgress;
