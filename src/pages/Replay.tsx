import React, { useState } from "react";

import { ApplicationDataType } from "../api/FileSystem.type";
import ApplicationsMenu from "../components/ApplicationsMenu";
import ReplayMain from "../components/Replay";
import WorkSpace from "../layout/WorkSpace";

const Replay = () => {
  const [curApp, setCurApp] = useState<ApplicationDataType>();
  return (
    <WorkSpace
      Main={<ReplayMain curApp={curApp} />}
      Side={<ApplicationsMenu onAppSelect={setCurApp} />}
    />
  );
};

export default Replay;
