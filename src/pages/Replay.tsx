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
          onSelect={setCurApp}
          placeholder="applicationsMenu.appFilterPlaceholder"
          request={ReplayService.regressionList}
          filter={(keyword: string, app: ApplicationDataType) =>
            app.appName.includes(keyword) || app.appId.includes(keyword)
          }
          itemRender={(app: ApplicationDataType) => ({
            label: `${app.appId}_${app.appName}`,
            key: app.appId,
          })}
        />
      }
    />
  );
};

export default Replay;
