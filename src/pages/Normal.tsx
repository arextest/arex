import { useState } from "react";

import { Root, RootParadigmKey } from "../api/FileSystem.type";
import { Collection, Http } from "../components";
import WorkSpace from "../layout/WorkSpace";

const Normal = () => {
  const [selectedRequest, setSelectedRequest] = useState<{
    id: string;
    path: Root<RootParadigmKey>[];
  }>({
    id: "",
    path: [],
  });

  return (
    <WorkSpace
      Main={<Http id={selectedRequest.id} path={selectedRequest.path} />}
      Side={<Collection changeSelectedRequest={setSelectedRequest} />}
    />
  );
};

export default Normal;
