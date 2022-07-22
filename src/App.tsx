import "./components/app/index.less";
import "./components/Collection/index.less";
import "./components/environment/index.less";

import CheckChromeExtension from "./components/CheckChromeExtension";
import { useRoutes } from "react-router-dom";
import routerConfig from "./routers";

function App() {
  const useRoutesRouterConfig = useRoutes(routerConfig);
  return <><CheckChromeExtension />{useRoutesRouterConfig}</>;
}

export default App;
