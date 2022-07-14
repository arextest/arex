import { useRequest } from "ahooks";
import React, { FC } from "react";

import ReplayService from "../../api/Replay.service";

const Analysis: FC<{ planItemId: number }> = ({ planItemId }) => {
  useRequest(() => ReplayService.queryResponseTypeStatistic({ planItemId }), {
    onSuccess(res) {
      console.log(res);
    },
  });

  return <>Analysis, planItemId: {planItemId}</>;
};

export default Analysis;
