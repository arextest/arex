import { useState } from "react";

import { Root, RootParadigmKey } from "../api/FileSystem.type";
import Collection from "../components/Collection";
import Http from "../components/Http";
import WorkSpace from "../layout/WorkSpace";

const Compare = () => {
  const [selectedRequest, setSelectedRequest] = useState<{
    id: string;
    path: Root<RootParadigmKey>[];
  }>({
    id: "",
    path: [],
  });

  return (
    <WorkSpace
      Main={
        <Http
          mode={"compare"}
          id={selectedRequest.id}
          path={selectedRequest.path}
        />
      }
      Side={<Collection changeSelectedRequest={setSelectedRequest} />}
    />
  );
};

export default Compare;
