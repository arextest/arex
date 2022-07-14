import React, { useState } from "react";

import ReplayService from "../api/Replay.service";
import { ApplicationDataType } from "../api/Replay.type";
import { MenuSelect, Replay as ReplayMain } from "../components";
import { WorkSpace } from "../layout";

const Replay = () => {
  const [curApp, setCurApp] = useState<ApplicationDataType>();
  return (
    <WorkSpace
      Main={<ReplayMain curApp={curApp} />}
      Side={
        <MenuSelect<ApplicationDataType>
          defaultSelectFirst
          rowKey="appId"
          onAppSelect={setCurApp}
          placeholder="applicationsMenu.appFilterPlaceholder"
          request={ReplayService.regressionList}
          filterFn={(keyword, app) =>
            app.appName.includes(keyword) || app.appId.includes(keyword)
          }
          itemRender={(app) => ({
            label: `${app.appId}_${app.appName}`,
            key: app.appId,
          })}
        />
      }
    />
  );
};

export default Replay;
