import React from "react";
import routerConfig from "./routers";
import { useRoutes } from "react-router-dom";

interface IProps {}

const App: React.FC<IProps> = () => {
  const useRoutesRouterConfig = useRoutes(routerConfig);
  return <div>{useRoutesRouterConfig}</div>;
};

export default App;
