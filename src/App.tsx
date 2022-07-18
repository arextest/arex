import React from "react";
import routerConfig from "./routers";
import { useRoutes } from "react-router-dom";
import CheckChromeExtension from "./components/CheckChromeExtension";

const App: React.FC = () => {
  const useRoutesRouterConfig = useRoutes(routerConfig);
  return (
    <>
      <CheckChromeExtension />
      {useRoutesRouterConfig}
    </>
  );
};

export default App;
